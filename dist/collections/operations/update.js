"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const sanitizeInternalFields_1 = __importDefault(require("../../utilities/sanitizeInternalFields"));
const executeAccess_1 = __importDefault(require("../../auth/executeAccess"));
const errors_1 = require("../../errors");
const types_1 = require("../../auth/types");
const saveCollectionDraft_1 = require("../../versions/drafts/saveCollectionDraft");
const saveCollectionVersion_1 = require("../../versions/saveCollectionVersion");
const uploadFile_1 = __importDefault(require("../../uploads/uploadFile"));
const cleanUpFailedVersion_1 = __importDefault(require("../../versions/cleanUpFailedVersion"));
const ensurePublishedCollectionVersion_1 = require("../../versions/ensurePublishedCollectionVersion");
const beforeChange_1 = require("../../fields/hooks/beforeChange");
const beforeValidate_1 = require("../../fields/hooks/beforeValidate");
const afterChange_1 = require("../../fields/hooks/afterChange");
const afterRead_1 = require("../../fields/hooks/afterRead");
async function update(incomingArgs) {
    let args = incomingArgs;
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////
    await args.collection.config.hooks.beforeOperation.reduce(async (priorHook, hook) => {
        await priorHook;
        args = (await hook({
            args,
            operation: 'update',
        })) || args;
    }, Promise.resolve());
    const { depth, collection, collection: { Model, config: collectionConfig, }, id, req, req: { locale, payload, payload: { config, }, }, overrideAccess, showHiddenFields, overwriteExistingFiles = false, draft: draftArg = false, autosave = false, } = args;
    let { data } = args;
    if (!id) {
        throw new errors_1.APIError('Missing ID of document to update.', http_status_1.default.BAD_REQUEST);
    }
    const shouldSaveDraft = Boolean(draftArg && collectionConfig.versions.drafts);
    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////
    const accessResults = !overrideAccess ? await (0, executeAccess_1.default)({ req, id, data }, collectionConfig.access.update) : true;
    const hasWherePolicy = (0, types_1.hasWhereAccessResult)(accessResults);
    // /////////////////////////////////////
    // Retrieve document
    // /////////////////////////////////////
    const queryToBuild = {
        where: {
            and: [
                {
                    id: {
                        equals: id,
                    },
                },
            ],
        },
    };
    if ((0, types_1.hasWhereAccessResult)(accessResults)) {
        queryToBuild.where.and.push(accessResults);
    }
    const query = await Model.buildQuery(queryToBuild, locale);
    const doc = await Model.findOne(query);
    if (!doc && !hasWherePolicy)
        throw new errors_1.NotFound();
    if (!doc && hasWherePolicy)
        throw new errors_1.Forbidden();
    let docWithLocales = doc.toJSON({ virtuals: true });
    docWithLocales = JSON.stringify(docWithLocales);
    docWithLocales = JSON.parse(docWithLocales);
    const originalDoc = await (0, afterRead_1.afterRead)({
        depth: 0,
        doc: docWithLocales,
        entityConfig: collectionConfig,
        req,
        overrideAccess: true,
        showHiddenFields,
    });
    // /////////////////////////////////////
    // Upload and resize potential files
    // /////////////////////////////////////
    data = await (0, uploadFile_1.default)({
        config,
        collection,
        req,
        data,
        throwOnMissingFile: false,
        overwriteExistingFiles,
    });
    // /////////////////////////////////////
    // beforeValidate - Fields
    // /////////////////////////////////////
    data = await (0, beforeValidate_1.beforeValidate)({
        data,
        doc: originalDoc,
        entityConfig: collectionConfig,
        id,
        operation: 'update',
        overrideAccess,
        req,
    });
    // // /////////////////////////////////////
    // // beforeValidate - Collection
    // // /////////////////////////////////////
    await collectionConfig.hooks.beforeValidate.reduce(async (priorHook, hook) => {
        await priorHook;
        data = (await hook({
            data,
            req,
            operation: 'update',
            originalDoc,
        })) || data;
    }, Promise.resolve());
    // /////////////////////////////////////
    // beforeChange - Collection
    // /////////////////////////////////////
    await collectionConfig.hooks.beforeChange.reduce(async (priorHook, hook) => {
        await priorHook;
        data = (await hook({
            data,
            req,
            originalDoc,
            operation: 'update',
        })) || data;
    }, Promise.resolve());
    // /////////////////////////////////////
    // beforeChange - Fields
    // /////////////////////////////////////
    let result = await (0, beforeChange_1.beforeChange)({
        data,
        doc: originalDoc,
        docWithLocales,
        entityConfig: collectionConfig,
        id,
        operation: 'update',
        req,
        skipValidation: shouldSaveDraft,
    });
    // /////////////////////////////////////
    // Handle potential password update
    // /////////////////////////////////////
    const { password } = data;
    if (password && collectionConfig.auth && !shouldSaveDraft) {
        await doc.setPassword(password);
        await doc.save();
        delete data.password;
        delete result.password;
    }
    // /////////////////////////////////////
    // Create version from existing doc
    // /////////////////////////////////////
    let createdVersion;
    if (collectionConfig.versions && !shouldSaveDraft) {
        createdVersion = await (0, saveCollectionVersion_1.saveCollectionVersion)({
            payload,
            config: collectionConfig,
            req,
            docWithLocales,
            id,
        });
    }
    // /////////////////////////////////////
    // Update
    // /////////////////////////////////////
    if (shouldSaveDraft) {
        await (0, ensurePublishedCollectionVersion_1.ensurePublishedCollectionVersion)({
            payload,
            config: collectionConfig,
            req,
            docWithLocales,
            id,
        });
        result = await (0, saveCollectionDraft_1.saveCollectionDraft)({
            payload,
            config: collectionConfig,
            req,
            data: result,
            id,
            autosave,
        });
    }
    else {
        try {
            result = await Model.findByIdAndUpdate({ _id: id }, result, { new: true });
        }
        catch (error) {
            (0, cleanUpFailedVersion_1.default)({
                payload,
                entityConfig: collectionConfig,
                version: createdVersion,
            });
            // Handle uniqueness error from MongoDB
            throw error.code === 11000 && error.keyValue
                ? new errors_1.ValidationError([{ message: 'Value must be unique', field: Object.keys(error.keyValue)[0] }])
                : error;
        }
        const resultString = JSON.stringify(result);
        result = JSON.parse(resultString);
        // custom id type reset
        result.id = result._id;
    }
    result = (0, sanitizeInternalFields_1.default)(result);
    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////
    result = await (0, afterRead_1.afterRead)({
        depth,
        doc: result,
        entityConfig: collectionConfig,
        req,
        overrideAccess,
        showHiddenFields,
    });
    // /////////////////////////////////////
    // afterRead - Collection
    // /////////////////////////////////////
    await collectionConfig.hooks.afterRead.reduce(async (priorHook, hook) => {
        await priorHook;
        result = await hook({
            req,
            doc: result,
        }) || result;
    }, Promise.resolve());
    // /////////////////////////////////////
    // afterChange - Fields
    // /////////////////////////////////////
    result = await (0, afterChange_1.afterChange)({
        data,
        doc: result,
        entityConfig: collectionConfig,
        operation: 'update',
        req,
    });
    // /////////////////////////////////////
    // afterChange - Collection
    // /////////////////////////////////////
    await collectionConfig.hooks.afterChange.reduce(async (priorHook, hook) => {
        await priorHook;
        result = await hook({
            doc: result,
            req,
            operation: 'update',
        }) || result;
    }, Promise.resolve());
    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////
    return result;
}
exports.default = update;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL29wZXJhdGlvbnMvdXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQXFDO0FBR3JDLG9HQUE0RTtBQUM1RSw2RUFBcUQ7QUFDckQseUNBQThFO0FBRTlFLDRDQUFzRTtBQUN0RSxtRkFBZ0Y7QUFDaEYsZ0ZBQTZFO0FBQzdFLDBFQUFrRDtBQUNsRCwrRkFBdUU7QUFDdkUsc0dBQW1HO0FBQ25HLGtFQUErRDtBQUMvRCxzRUFBbUU7QUFDbkUsZ0VBQTZEO0FBQzdELDREQUF5RDtBQWdCekQsS0FBSyxVQUFVLE1BQU0sQ0FBQyxZQUF1QjtJQUMzQyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUM7SUFFeEIsd0NBQXdDO0lBQ3hDLCtCQUErQjtJQUMvQix3Q0FBd0M7SUFFeEMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ2xGLE1BQU0sU0FBUyxDQUFDO1FBRWhCLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDO1lBQ2pCLElBQUk7WUFDSixTQUFTLEVBQUUsUUFBUTtTQUNwQixDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDZCxDQUFDLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFFdEIsTUFBTSxFQUNKLEtBQUssRUFDTCxVQUFVLEVBQ1YsVUFBVSxFQUFFLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFBRSxnQkFBZ0IsR0FDekIsRUFDRCxFQUFFLEVBQ0YsR0FBRyxFQUNILEdBQUcsRUFBRSxFQUNILE1BQU0sRUFDTixPQUFPLEVBQ1AsT0FBTyxFQUFFLEVBQ1AsTUFBTSxHQUNQLEdBQ0YsRUFDRCxjQUFjLEVBQ2QsZ0JBQWdCLEVBQ2hCLHNCQUFzQixH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