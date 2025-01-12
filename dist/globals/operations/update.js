"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const executeAccess_1 = __importDefault(require("../../auth/executeAccess"));
const sanitizeInternalFields_1 = __importDefault(require("../../utilities/sanitizeInternalFields"));
const saveGlobalVersion_1 = require("../../versions/saveGlobalVersion");
const saveGlobalDraft_1 = require("../../versions/drafts/saveGlobalDraft");
const ensurePublishedGlobalVersion_1 = require("../../versions/ensurePublishedGlobalVersion");
const cleanUpFailedVersion_1 = __importDefault(require("../../versions/cleanUpFailedVersion"));
const auth_1 = require("../../auth");
const beforeChange_1 = require("../../fields/hooks/beforeChange");
const beforeValidate_1 = require("../../fields/hooks/beforeValidate");
const afterChange_1 = require("../../fields/hooks/afterChange");
const afterRead_1 = require("../../fields/hooks/afterRead");
async function update(args) {
    var _a;
    const { globalConfig, slug, req, req: { locale, payload, payload: { globals: { Model, }, }, }, depth, overrideAccess, showHiddenFields, draft: draftArg, autosave, } = args;
    let { data } = args;
    const shouldSaveDraft = Boolean(draftArg && ((_a = globalConfig.versions) === null || _a === void 0 ? void 0 : _a.drafts));
    // /////////////////////////////////////
    // 1. Retrieve and execute access
    // /////////////////////////////////////
    const accessResults = !overrideAccess ? await (0, executeAccess_1.default)({ req, data }, globalConfig.access.update) : true;
    // /////////////////////////////////////
    // Retrieve document
    // /////////////////////////////////////
    const queryToBuild = {
        where: {
            and: [
                {
                    globalType: {
                        equals: slug,
                    },
                },
            ],
        },
    };
    if ((0, auth_1.hasWhereAccessResult)(accessResults)) {
        queryToBuild.where.and.push(accessResults);
    }
    const query = await Model.buildQuery(queryToBuild, locale);
    // /////////////////////////////////////
    // 2. Retrieve document
    // /////////////////////////////////////
    let global = await Model.findOne(query);
    let globalJSON = {};
    if (global) {
        globalJSON = global.toJSON({ virtuals: true });
        const globalJSONString = JSON.stringify(globalJSON);
        globalJSON = JSON.parse(globalJSONString);
        if (globalJSON._id) {
            delete globalJSON._id;
        }
    }
    const originalDoc = await (0, afterRead_1.afterRead)({
        depth,
        doc: globalJSON,
        entityConfig: globalConfig,
        req,
        overrideAccess: true,
        showHiddenFields,
    });
    // /////////////////////////////////////
    // beforeValidate - Fields
    // /////////////////////////////////////
    data = await (0, beforeValidate_1.beforeValidate)({
        data,
        doc: originalDoc,
        entityConfig: globalConfig,
        operation: 'update',
        overrideAccess,
        req,
    });
    // /////////////////////////////////////
    // beforeValidate - Global
    // /////////////////////////////////////
    await globalConfig.hooks.beforeValidate.reduce(async (priorHook, hook) => {
        await priorHook;
        data = (await hook({
            data,
            req,
            originalDoc,
        })) || data;
    }, Promise.resolve());
    // /////////////////////////////////////
    // beforeChange - Global
    // /////////////////////////////////////
    await globalConfig.hooks.beforeChange.reduce(async (priorHook, hook) => {
        await priorHook;
        data = (await hook({
            data,
            req,
            originalDoc,
        })) || data;
    }, Promise.resolve());
    // /////////////////////////////////////
    // beforeChange - Fields
    // /////////////////////////////////////
    const result = await (0, beforeChange_1.beforeChange)({
        data,
        doc: originalDoc,
        docWithLocales: globalJSON,
        entityConfig: globalConfig,
        operation: 'update',
        req,
        skipValidation: shouldSaveDraft,
    });
    // /////////////////////////////////////
    // Create version from existing doc
    // /////////////////////////////////////
    let createdVersion;
    if (globalConfig.versions && !shouldSaveDraft) {
        createdVersion = await (0, saveGlobalVersion_1.saveGlobalVersion)({
            payload,
            config: globalConfig,
            req,
            docWithLocales: result,
        });
    }
    // /////////////////////////////////////
    // Update
    // /////////////////////////////////////
    if (shouldSaveDraft) {
        await (0, ensurePublishedGlobalVersion_1.ensurePublishedGlobalVersion)({
            payload,
            config: globalConfig,
            req,
            docWithLocales: result,
        });
        global = await (0, saveGlobalDraft_1.saveGlobalDraft)({
            payload,
            config: globalConfig,
            data: result,
            autosave,
        });
    }
    else {
        try {
            if (global) {
                global = await Model.findOneAndUpdate({ globalType: slug }, result, { new: true });
            }
            else {
                result.globalType = slug;
                global = await Model.create(result);
            }
        }
        catch (error) {
            (0, cleanUpFailedVersion_1.default)({
                payload,
                entityConfig: globalConfig,
                version: createdVersion,
            });
        }
    }
    global = JSON.stringify(global);
    global = JSON.parse(global);
    global = (0, sanitizeInternalFields_1.default)(global);
    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////
    global = await (0, afterRead_1.afterRead)({
        depth,
        doc: global,
        entityConfig: globalConfig,
        req,
        overrideAccess,
        showHiddenFields,
    });
    // /////////////////////////////////////
    // afterRead - Global
    // /////////////////////////////////////
    await globalConfig.hooks.afterChange.reduce(async (priorHook, hook) => {
        await priorHook;
        global = await hook({
            doc: global,
            req,
        }) || global;
    }, Promise.resolve());
    // /////////////////////////////////////
    // afterChange - Fields
    // /////////////////////////////////////
    global = await (0, afterChange_1.afterChange)({
        data,
        doc: global,
        entityConfig: globalConfig,
        operation: 'update',
        req,
    });
    // /////////////////////////////////////
    // afterChange - Global
    // /////////////////////////////////////
    await globalConfig.hooks.afterChange.reduce(async (priorHook, hook) => {
        await priorHook;
        global = await hook({
            doc: global,
            req,
        }) || result;
    }, Promise.resolve());
    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////
    return global;
}
exports.default = update;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dsb2JhbHMvb3BlcmF0aW9ucy91cGRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSw2RUFBcUQ7QUFDckQsb0dBQTRFO0FBQzVFLHdFQUFxRTtBQUNyRSwyRUFBd0U7QUFDeEUsOEZBQTJGO0FBQzNGLCtGQUF1RTtBQUN2RSxxQ0FBa0Q7QUFDbEQsa0VBQStEO0FBQy9ELHNFQUFtRTtBQUNuRSxnRUFBNkQ7QUFDN0QsNERBQXlEO0FBZXpELEtBQUssVUFBVSxNQUFNLENBQTZCLElBQVU7O0lBQzFELE1BQU0sRUFDSixZQUFZLEVBQ1osSUFBSSxFQUNKLEdBQUcsRUFDSCxHQUFHLEVBQUUsRUFDSCxNQUFNLEVBQ04sT0FBTyxFQUNQLE9BQU8sRUFBRSxFQUNQLE9BQU8sRUFBRSxFQUNQLEtBQUssR0FDTixHQUNGLEdBQ0YsRUFDRCxLQUFLLEVBQ0wsY0FBYyxFQUNkLGdCQUFnQixFQUNoQixLQUFLLEVBQUUsUUFBUSxFQUNmLFFBQVEsR0FDVCxHQUFHLElBQUksQ0FBQztJQUVULElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFFcEIsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSSxNQUFBLFlBQVksQ0FBQyxRQUFRLDBDQUFFLE1BQU0sQ0FBQSxDQUFDLENBQUM7SUFFM0Usd0NBQXdDO0lBQ3hDLGlDQUFpQztJQUNqQyx3Q0FBd0M7SUFFeEMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBQSx1QkFBYSxFQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUU5Ryx3Q0FBd0M7SUFDeEMsb0JBQW9CO0lBQ3BCLHdDQUF3QztJQUV4QyxNQUFNLFlBQVksR0FBcUI7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