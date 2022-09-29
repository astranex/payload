"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const executeAccess_1 = __importDefault(require("../../auth/executeAccess"));
const sanitizeInternalFields_1 = __importDefault(require("../../utilities/sanitizeInternalFields"));
const types_1 = require("../../auth/types");
const flattenWhereConstraints_1 = __importDefault(require("../../utilities/flattenWhereConstraints"));
const buildSortParam_1 = require("../../mongoose/buildSortParam");
const afterRead_1 = require("../../fields/hooks/afterRead");
async function findVersions(args) {
    const { where, page, limit, depth, collection: { config: collectionConfig, }, req, req: { locale, payload, }, overrideAccess, showHiddenFields, } = args;
    const VersionsModel = payload.versions[collectionConfig.slug];
    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////
    const queryToBuild = {};
    let useEstimatedCount = false;
    if (where) {
        let and = [];
        if (Array.isArray(where.and))
            and = where.and;
        if (Array.isArray(where.AND))
            and = where.AND;
        queryToBuild.where = {
            ...where,
            and: [
                ...and,
            ],
        };
        const constraints = (0, flattenWhereConstraints_1.default)(queryToBuild);
        useEstimatedCount = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'));
    }
    if (!overrideAccess) {
        const accessResults = await (0, executeAccess_1.default)({ req }, collectionConfig.access.readVersions);
        if ((0, types_1.hasWhereAccessResult)(accessResults)) {
            if (!where) {
                queryToBuild.where = {
                    and: [
                        accessResults,
                    ],
                };
            }
            else {
                queryToBuild.where.and.push(accessResults);
            }
        }
    }
    const query = await VersionsModel.buildQuery(queryToBuild, locale);
    // /////////////////////////////////////
    // Find
    // /////////////////////////////////////
    const [sortProperty, sortOrder] = (0, buildSortParam_1.buildSortParam)(args.sort || '-updatedAt', true);
    const optionsToExecute = {
        page: page || 1,
        limit: limit || 10,
        sort: {
            [sortProperty]: sortOrder,
        },
        lean: true,
        leanWithId: true,
        useEstimatedCount,
    };
    const paginatedDocs = await VersionsModel.paginate(query, optionsToExecute);
    // /////////////////////////////////////
    // beforeRead - Collection
    // /////////////////////////////////////
    let result = {
        ...paginatedDocs,
        docs: await Promise.all(paginatedDocs.docs.map(async (doc) => {
            const docString = JSON.stringify(doc);
            const docRef = JSON.parse(docString);
            await collectionConfig.hooks.beforeRead.reduce(async (priorHook, hook) => {
                await priorHook;
                docRef.version = await hook({ req, query, doc: docRef.version }) || docRef.version;
            }, Promise.resolve());
            return docRef;
        })),
    };
    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////
    result = {
        ...result,
        docs: await Promise.all(result.docs.map(async (data) => ({
            ...data,
            version: await (0, afterRead_1.afterRead)({
                depth,
                doc: data.version,
                entityConfig: collectionConfig,
                overrideAccess,
                req,
                showHiddenFields,
                findMany: true,
            }),
        }))),
    };
    // /////////////////////////////////////
    // afterRead - Collection
    // /////////////////////////////////////
    result = {
        ...result,
        docs: await Promise.all(result.docs.map(async (doc) => {
            const docRef = doc;
            await collectionConfig.hooks.afterRead.reduce(async (priorHook, hook) => {
                await priorHook;
                docRef.version = await hook({ req, query, doc: doc.version, findMany: true }) || doc.version;
            }, Promise.resolve());
            return docRef;
        })),
    };
    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////
    result = {
        ...result,
        docs: result.docs.map((doc) => (0, sanitizeInternalFields_1.default)(doc)),
    };
    return result;
}
exports.default = findVersions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZFZlcnNpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL29wZXJhdGlvbnMvZmluZFZlcnNpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsNkVBQXFEO0FBQ3JELG9HQUE0RTtBQUU1RSw0Q0FBd0Q7QUFDeEQsc0dBQThFO0FBQzlFLGtFQUErRDtBQUcvRCw0REFBeUQ7QUFjekQsS0FBSyxVQUFVLFlBQVksQ0FBcUMsSUFBZTtJQUM3RSxNQUFNLEVBQ0osS0FBSyxFQUNMLElBQUksRUFDSixLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFBRSxFQUNWLE1BQU0sRUFBRSxnQkFBZ0IsR0FDekIsRUFDRCxHQUFHLEVBQ0gsR0FBRyxFQUFFLEVBQ0gsTUFBTSxFQUNOLE9BQU8sR0FDUixFQUNELGNBQWMsRUFDZCxnQkFBZ0IsR0FDakIsR0FBRyxJQUFJLENBQUM7SUFFVCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBb0IsQ0FBQztJQUVqRix3Q0FBd0M7SUFDeEMsU0FBUztJQUNULHdDQUF3QztJQUV4QyxNQUFNLFlBQVksR0FBcUIsRUFBRSxDQUFDO0lBQzFDLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBRTlCLElBQUksS0FBSyxFQUFFO1FBQ1QsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUM5QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBRTlDLFlBQVksQ0FBQyxLQUFLLEdBQUc7WUFDbkIsR0FBRyxLQUFLO1lBQ1IsR0FBRyxFQUFFO2dCQUNILEdB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