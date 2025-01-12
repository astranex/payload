"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const executeAccess_1 = __importDefault(require("../../auth/executeAccess"));
const sanitizeInternalFields_1 = __importDefault(require("../../utilities/sanitizeInternalFields"));
const errors_1 = require("../../errors");
const afterChange_1 = require("../../fields/hooks/afterChange");
const afterRead_1 = require("../../fields/hooks/afterRead");
async function restoreVersion(args) {
    const { id, depth, globalConfig, req, req: { payload, payload: { globals: { Model, }, }, }, overrideAccess, showHiddenFields, } = args;
    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////
    if (!overrideAccess) {
        await (0, executeAccess_1.default)({ req }, globalConfig.access.update);
    }
    // /////////////////////////////////////
    // Retrieve original raw version
    // /////////////////////////////////////
    const VersionModel = payload.versions[globalConfig.slug];
    let rawVersion = await VersionModel.findOne({
        _id: id,
    });
    if (!rawVersion) {
        throw new errors_1.NotFound();
    }
    rawVersion = rawVersion.toJSON({ virtuals: true });
    // /////////////////////////////////////
    // Update global
    // /////////////////////////////////////
    const global = await Model.findOne({ globalType: globalConfig.slug });
    let result = rawVersion.version;
    if (global) {
        result = await Model.findOneAndUpdate({ globalType: globalConfig.slug }, result, { new: true });
    }
    else {
        result.globalType = globalConfig.slug;
        result = await Model.create(result);
    }
    result = result.toJSON({ virtuals: true });
    // custom id type reset
    result.id = result._id;
    result = JSON.stringify(result);
    result = JSON.parse(result);
    result = (0, sanitizeInternalFields_1.default)(result);
    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////
    result = await (0, afterRead_1.afterRead)({
        depth,
        doc: result,
        entityConfig: globalConfig,
        req,
        overrideAccess,
        showHiddenFields,
    });
    // /////////////////////////////////////
    // afterRead - Global
    // /////////////////////////////////////
    await globalConfig.hooks.afterRead.reduce(async (priorHook, hook) => {
        await priorHook;
        result = await hook({
            doc: result,
            req,
        }) || result;
    }, Promise.resolve());
    // /////////////////////////////////////
    // afterChange - Fields
    // /////////////////////////////////////
    result = await (0, afterChange_1.afterChange)({
        data: result,
        doc: result,
        entityConfig: globalConfig,
        operation: 'update',
        req,
    });
    // /////////////////////////////////////
    // afterChange - Global
    // /////////////////////////////////////
    await globalConfig.hooks.afterChange.reduce(async (priorHook, hook) => {
        await priorHook;
        result = await hook({
            doc: result,
            req,
        }) || result;
    }, Promise.resolve());
    return result;
}
exports.default = restoreVersion;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdG9yZVZlcnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ2xvYmFscy9vcGVyYXRpb25zL3Jlc3RvcmVWZXJzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNkVBQXFEO0FBQ3JELG9HQUE0RTtBQUc1RSx5Q0FBd0M7QUFDeEMsZ0VBQTZEO0FBQzdELDREQUF5RDtBQVd6RCxLQUFLLFVBQVUsY0FBYyxDQUFxQyxJQUFlO0lBQy9FLE1BQU0sRUFDSixFQUFFLEVBQ0YsS0FBSyxFQUNMLFlBQVksRUFDWixHQUFHLEVBQ0gsR0FBRyxFQUFFLEVBQ0gsT0FBTyxFQUNQLE9BQU8sRUFBRSxFQUNQLE9BQU8sRUFBRSxFQUNQLEtBQUssR0FDTixHQUNGLEdBQ0YsRUFDRCxjQUFjLEVBQ2QsZ0JBQWdCLEdBQ2pCLEdBQUcsSUFBSSxDQUFDO0lBRVQsd0NBQXdDO0lBQ3hDLFNBQVM7SUFDVCx3Q0FBd0M7SUFFeEMsSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUNuQixNQUFNLElBQUEsdUJBQWEsRUFBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDMUQ7SUFFRCx3Q0FBd0M7SUFDeEMsZ0NBQWdDO0lBQ2hDLHdDQUF3QztJQUV4QyxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV6RCxJQUFJLFVBQVUsR0FBRyxNQUFNLFlBQVksQ0FBQyxPQUFPLENBQUM7UUFDMUMsR0FBRyxFQUFFLEVBQUU7S0FDUixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2YsTUFBTSxJQUFJLGlCQUFRLEVBQUUsQ0FBQztLQUN0QjtJQUVELFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFFbkQsd0NBQXdDO0lB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