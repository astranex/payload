"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminInit_1 = require("../../utilities/telemetry/events/adminInit");
const allOperations = ['create', 'read', 'update', 'delete'];
async function accessOperation(args) {
    const { req, req: { user, payload: { config, }, }, } = args;
    (0, adminInit_1.adminInit)(req);
    const results = {};
    const promises = [];
    const isLoggedIn = !!(user);
    const userCollectionConfig = (user && user.collection) ? config.collections.find((collection) => collection.slug === user.collection) : null;
    const createAccessPromise = async (obj, access, operation, disableWhere = false) => {
        var _a;
        const updatedObj = obj;
        const result = await access({ req });
        if (typeof result === 'object' && !disableWhere) {
            updatedObj[operation] = {
                permission: true,
                where: result,
            };
        }
        else if (((_a = updatedObj[operation]) === null || _a === void 0 ? void 0 : _a.permission) !== false) {
            updatedObj[operation] = {
                permission: !!(result),
            };
        }
    };
    const executeFieldPolicies = (obj, fields, operation) => {
        const updatedObj = obj;
        fields.forEach(async (field) => {
            if (field.name) {
                if (!updatedObj[field.name])
                    updatedObj[field.name] = {};
                if (field.access && typeof field.access[operation] === 'function') {
                    promises.push(createAccessPromise(updatedObj[field.name], field.access[operation], operation, true));
                }
                else {
                    updatedObj[field.name][operation] = {
                        permission: isLoggedIn,
                    };
                }
                if (field.fields) {
                    if (!updatedObj[field.name].fields)
                        updatedObj[field.name].fields = {};
                    executeFieldPolicies(updatedObj[field.name].fields, field.fields, operation);
                }
            }
            else if (field.fields) {
                executeFieldPolicies(updatedObj, field.fields, operation);
            }
            else if (field.type === 'tabs') {
                field.tabs.forEach((tab) => {
                    executeFieldPolicies(updatedObj, tab.fields, operation);
                });
            }
        });
    };
    const executeEntityPolicies = (entity, operations, type) => {
        if (!results[type])
            results[type] = {};
        results[type][entity.slug] = {
            fields: {},
        };
        operations.forEach((operation) => {
            executeFieldPolicies(results[type][entity.slug].fields, entity.fields, operation);
            if (typeof entity.access[operation] === 'function') {
                promises.push(createAccessPromise(results[type][entity.slug], entity.access[operation], operation));
            }
            else {
                results[type][entity.slug][operation] = {
                    permission: isLoggedIn,
                };
            }
        });
    };
    if (userCollectionConfig) {
        results.canAccessAdmin = userCollectionConfig.access.admin ? userCollectionConfig.access.admin(args) : isLoggedIn;
    }
    else {
        results.canAccessAdmin = false;
    }
    config.collections.forEach((collection) => {
        const collectionOperations = [...allOperations];
        if (collection.auth && (typeof collection.auth.maxLoginAttempts !== 'undefined' && collection.auth.maxLoginAttempts !== 0)) {
            collectionOperations.push('unlock');
        }
        if (collection.versions) {
            collectionOperations.push('readVersions');
        }
        executeEntityPolicies(collection, collectionOperations, 'collections');
    });
    config.globals.forEach((global) => {
        const globalOperations = ['read', 'update'];
        if (global.versions) {
            globalOperations.push('readVersions');
        }
        executeEntityPolicies(global, globalOperations, 'globals');
    });
    await Promise.all(promises);
    return results;
}
exports.default = accessOperation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F1dGgvb3BlcmF0aW9ucy9hY2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBNkY7QUFFN0YsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQU03RCxLQUFLLFVBQVUsZUFBZSxDQUFDLElBQWU7SUFDNUMsTUFBTSxFQUNKLEdBQUcsRUFDSCxHQUFHLEVBQUUsRUFDSCxJQUFJLEVBQ0osT0FBTyxFQUFFLEVBQ1AsTUFBTSxHQUNQLEdBQ0YsR0FDRixHQUFHLElBQUksQ0FBQztJQUVULElBQUEscUJBQWtCLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFFeEIsTUFBTSxPQUFPLEdBQUcsRUFBaUIsQ0FBQztJQUNsQyxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFFcEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRTdJLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQVksR0FBRyxLQUFLLEVBQUUsRUFBRTs7UUFDakYsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUVyQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFB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