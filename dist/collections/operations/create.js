"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const executeAccess_1 = __importDefault(require("../../auth/executeAccess"));
const sanitizeInternalFields_1 = __importDefault(require("../../utilities/sanitizeInternalFields"));
const errors_1 = require("../../errors");
const sendVerificationEmail_1 = __importDefault(require("../../auth/sendVerificationEmail"));
const types_1 = require("../../fields/config/types");
const uploadFile_1 = __importDefault(require("../../uploads/uploadFile"));
const beforeChange_1 = require("../../fields/hooks/beforeChange");
const beforeValidate_1 = require("../../fields/hooks/beforeValidate");
const afterChange_1 = require("../../fields/hooks/afterChange");
const afterRead_1 = require("../../fields/hooks/afterRead");
async function create(incomingArgs) {
    let args = incomingArgs;
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////
    await args.collection.config.hooks.beforeOperation.reduce(async (priorHook, hook) => {
        await priorHook;
        args = (await hook({
            args,
            operation: 'create',
        })) || args;
    }, Promise.resolve());
    const { collection, collection: { Model, config: collectionConfig, }, req, req: { payload, payload: { config, emailOptions, }, }, disableVerificationEmail, depth, overrideAccess, showHiddenFields, overwriteExistingFiles = false, draft = false, } = args;
    let { data } = args;
    const shouldSaveDraft = Boolean(draft && collectionConfig.versions.drafts);
    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////
    if (!overrideAccess) {
        await (0, executeAccess_1.default)({ req, data }, collectionConfig.access.create);
    }
    // /////////////////////////////////////
    // Custom id
    // /////////////////////////////////////
    const hasIdField = collectionConfig.fields.findIndex((field) => (0, types_1.fieldAffectsData)(field) && field.name === 'id') > -1;
    if (hasIdField) {
        data = {
            _id: data.id,
            ...data,
        };
    }
    // /////////////////////////////////////
    // Upload and resize potential files
    // /////////////////////////////////////
    data = await (0, uploadFile_1.default)({
        config,
        collection,
        req,
        data,
        throwOnMissingFile: !shouldSaveDraft,
        overwriteExistingFiles,
    });
    // /////////////////////////////////////
    // beforeValidate - Fields
    // /////////////////////////////////////
    data = await (0, beforeValidate_1.beforeValidate)({
        data,
        doc: {},
        entityConfig: collectionConfig,
        operation: 'create',
        overrideAccess,
        req,
    });
    // /////////////////////////////////////
    // beforeValidate - Collections
    // /////////////////////////////////////
    await collectionConfig.hooks.beforeValidate.reduce(async (priorHook, hook) => {
        await priorHook;
        data = (await hook({
            data,
            req,
            operation: 'create',
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
            operation: 'create',
        })) || data;
    }, Promise.resolve());
    // /////////////////////////////////////
    // beforeChange - Fields
    // /////////////////////////////////////
    const resultWithLocales = await (0, beforeChange_1.beforeChange)({
        data,
        doc: {},
        docWithLocales: {},
        entityConfig: collectionConfig,
        operation: 'create',
        req,
        skipValidation: shouldSaveDraft,
    });
    // /////////////////////////////////////
    // Create
    // /////////////////////////////////////
    let doc;
    if (collectionConfig.auth && !collectionConfig.auth.disableLocalStrategy) {
        if (data.email) {
            resultWithLocales.email = data.email.toLowerCase();
        }
        if (collectionConfig.auth.verify) {
            resultWithLocales._verified = false;
            resultWithLocales._verificationToken = crypto_1.default.randomBytes(20).toString('hex');
        }
        try {
            doc = await Model.register(resultWithLocales, data.password);
        }
        catch (error) {
            // Handle user already exists from passport-local-mongoose
            if (error.name === 'UserExistsError') {
                throw new errors_1.ValidationError([{ message: error.message, field: 'email' }]);
            }
            throw error;
        }
    }
    else {
        try {
            doc = await Model.create(resultWithLocales);
        }
        catch (error) {
            // Handle uniqueness error from MongoDB
            throw error.code === 11000 && error.keyValue
                ? new errors_1.ValidationError([{ message: 'Value must be unique', field: Object.keys(error.keyValue)[0] }])
                : error;
        }
    }
    let result = doc.toJSON({ virtuals: true });
    const verificationToken = result._verificationToken;
    // custom id type reset
    result.id = result._id;
    result = JSON.stringify(result);
    result = JSON.parse(result);
    result = (0, sanitizeInternalFields_1.default)(result);
    // /////////////////////////////////////
    // Send verification email if applicable
    // /////////////////////////////////////
    if (collectionConfig.auth && collectionConfig.auth.verify) {
        (0, sendVerificationEmail_1.default)({
            emailOptions,
            config: payload.config,
            sendEmail: payload.sendEmail,
            collection: { config: collectionConfig, Model },
            user: result,
            token: verificationToken,
            req,
            disableEmail: disableVerificationEmail,
        });
    }
    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////
    result = await (0, afterRead_1.afterRead)({
        depth,
        doc: result,
        entityConfig: collectionConfig,
        overrideAccess,
        req,
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
        operation: 'create',
        req,
    });
    // /////////////////////////////////////
    // afterChange - Collection
    // /////////////////////////////////////
    await collectionConfig.hooks.afterChange.reduce(async (priorHook, hook) => {
        await priorHook;
        result = await hook({
            doc: result,
            req: args.req,
            operation: 'create',
        }) || result;
    }, Promise.resolve());
    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////
    return result;
}
exports.default = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL29wZXJhdGlvbnMvY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBRTVCLDZFQUFxRDtBQUNyRCxvR0FBNEU7QUFFNUUseUNBQStDO0FBRS9DLDZGQUFxRTtBQUlyRSxxREFBNkQ7QUFDN0QsMEVBQWtEO0FBQ2xELGtFQUErRDtBQUMvRCxzRUFBbUU7QUFDbkUsZ0VBQTZEO0FBQzdELDREQUF5RDtBQWN6RCxLQUFLLFVBQVUsTUFBTSxDQUFDLFlBQXVCO0lBQzNDLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQztJQUV4Qix3Q0FBd0M7SUFDeEMsK0JBQStCO0lBQy9CLHdDQUF3QztJQUV4QyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUE4QyxFQUFFLElBQXlCLEVBQUUsRUFBRTtRQUM1SSxNQUFNLFNBQVMsQ0FBQztRQUVoQixJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQztZQUNqQixJQUFJO1lBQ0osU0FBUyxFQUFFLFFBQVE7U0FDcEIsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO0lBQ2QsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBRXRCLE1BQU0sRUFDSixVQUFVLEVBQ1YsVUFBVSxFQUFFLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFBRSxnQkFBZ0IsR0FDekIsRUFDRCxHQUFHLEVBQ0gsR0FBRyxFQUFFLEVBQ0gsT0FBTyxFQUNQLE9BQU8sRUFBRSxFQUNQLE1BQU0sRUFDTixZQUFZLEdBQ2IsR0FDRixFQUNELHdCQUF3QixFQUN4QixLQUFLLEVBQ0wsY0FBYyxFQUNkLGdCQUFnQixFQUNoQixzQkFBc0IsR0FBRyxLQUFLLEVBQzlCLEtBQUssR0FBRyxLQUFLLEdBQ2Qs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