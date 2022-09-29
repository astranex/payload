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
    const { where, page, limit, depth, globalConfig, req, req: { locale, payload, }, overrideAccess, showHiddenFields, } = args;
    const VersionsModel = payload.versions[globalConfig.slug];
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
        const accessResults = await (0, executeAccess_1.default)({ req }, globalConfig.access.readVersions);
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
    // afterRead - Fields
    // /////////////////////////////////////
    let result = {
        ...paginatedDocs,
        docs: await Promise.all(paginatedDocs.docs.map(async (data) => ({
            ...data,
            version: await (0, afterRead_1.afterRead)({
                depth,
                doc: data.version,
                entityConfig: globalConfig,
                req,
                overrideAccess,
                showHiddenFields,
                findMany: true,
            }),
        }))),
    };
    // /////////////////////////////////////
    // afterRead - Global
    // /////////////////////////////////////
    result = {
        ...result,
        docs: await Promise.all(result.docs.map(async (doc) => {
            const docRef = doc;
            await globalConfig.hooks.afterRead.reduce(async (priorHook, hook) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZFZlcnNpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dsb2JhbHMvb3BlcmF0aW9ucy9maW5kVmVyc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSw2RUFBcUQ7QUFDckQsb0dBQTRFO0FBRTVFLDRDQUF3RDtBQUN4RCxzR0FBOEU7QUFDOUUsa0VBQStEO0FBRy9ELDREQUF5RDtBQWN6RCxLQUFLLFVBQVUsWUFBWSxDQUFxQyxJQUFlO0lBQzdFLE1BQU0sRUFDSixLQUFLLEVBQ0wsSUFBSSxFQUNKLEtBQUssRUFDTCxLQUFLLEVBQ0wsWUFBWSxFQUNaLEdBQUcsRUFDSCxHQUFHLEVBQUUsRUFDSCxNQUFNLEVBQ04sT0FBTyxHQUNSLEVBQ0QsY0FBYyxFQUNkLGdCQUFnQixHQUNqQixHQUFHLElBQUksQ0FBQztJQUVULE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTFELHdDQUF3QztJQUN4QyxTQUFTO0lBQ1Qsd0NBQXdDO0lBRXhDLE1BQU0sWUFBWSxHQUFxQixFQUFFLENBQUM7SUFDMUMsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7SUFFOUIsSUFBSSxLQUFLLEVBQUU7UUFDVCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFFYixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQzlDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFFOUMsWUFBWSxDQUFDLEtBQUssR0FBRztZQUNuQixHQUFHLEtBQUs7WUFDUixHQUFHLEVBQUU7Z0JBQ0gsR0FBRyxHQUFHO2FBQ1A7U0FDRixDQUFDO1FBRUYsTUFBTSxXQUFXLEdB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