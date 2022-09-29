"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promise = void 0;
/* eslint-disable no-param-reassign */
const types_1 = require("../../config/types");
const traverseFields_1 = require("./traverseFields");
const relationshipPromise_1 = __importDefault(require("../../richText/relationshipPromise"));
const relationshipPopulationPromise_1 = __importDefault(require("./relationshipPopulationPromise"));
// This function is responsible for the following actions, in order:
// - Remove hidden fields from response
// - Flatten locales into requested locale
// - Sanitize outgoing data (point field, etc)
// - Execute field hooks
// - Execute read access control
// - Populate relationships
const promise = async ({ currentDepth, depth, doc, field, fieldPromises, findMany, flattenLocales, overrideAccess, populationPromises, req, siblingDoc, showHiddenFields, }) => {
    var _a, _b, _c, _d, _e, _f;
    if ((0, types_1.fieldAffectsData)(field) && field.hidden && typeof siblingDoc[field.name] !== 'undefined' && !showHiddenFields) {
        delete siblingDoc[field.name];
    }
    const hasLocalizedValue = flattenLocales
        && (0, types_1.fieldAffectsData)(field)
        && (typeof siblingDoc[field.name] === 'object' && siblingDoc[field.name] !== null)
        && field.name
        && field.localized
        && req.locale !== 'all';
    if (hasLocalizedValue) {
        let localizedValue = siblingDoc[field.name][req.locale];
        if (typeof localizedValue === 'undefined' && req.fallbackLocale)
            localizedValue = siblingDoc[field.name][req.fallbackLocale];
        if (typeof localizedValue === 'undefined' && field.type === 'group')
            localizedValue = {};
        if (typeof localizedValue === 'undefined')
            localizedValue = null;
        siblingDoc[field.name] = localizedValue;
    }
    // Sanitize outgoing data
    switch (field.type) {
        case 'group': {
            // Fill groups with empty objects so fields with hooks within groups can populate
            // themselves virtually as necessary
            if (typeof siblingDoc[field.name] === 'undefined') {
                siblingDoc[field.name] = {};
            }
            break;
        }
        case 'richText': {
            if (((((_b = (_a = field.admin) === null || _a === void 0 ? void 0 : _a.elements) === null || _b === void 0 ? void 0 : _b.includes('relationship')) || ((_d = (_c = field.admin) === null || _c === void 0 ? void 0 : _c.elements) === null || _d === void 0 ? void 0 : _d.includes('upload'))) || !((_e = field === null || field === void 0 ? void 0 : field.admin) === null || _e === void 0 ? void 0 : _e.elements))) {
                populationPromises.push((0, relationshipPromise_1.default)({
                    currentDepth,
                    depth,
                    field,
                    overrideAccess,
                    req,
                    siblingDoc,
                    showHiddenFields,
                }));
            }
            break;
        }
        case 'point': {
            const pointDoc = siblingDoc[field.name];
            if (Array.isArray(pointDoc === null || pointDoc === void 0 ? void 0 : pointDoc.coordinates) && pointDoc.coordinates.length === 2) {
                siblingDoc[field.name] = pointDoc.coordinates;
            }
            break;
        }
        default: {
            break;
        }
    }
    if ((0, types_1.fieldAffectsData)(field)) {
        // Execute hooks
        if ((_f = field.hooks) === null || _f === void 0 ? void 0 : _f.afterRead) {
            await field.hooks.afterRead.reduce(async (priorHook, currentHook) => {
                await priorHook;
                const shouldRunHookOnAllLocales = field.localized
                    && (req.locale === 'all' || !flattenLocales)
                    && typeof siblingDoc[field.name] === 'object';
                if (shouldRunHookOnAllLocales) {
                    const hookPromises = Object.entries(siblingDoc[field.name]).map(([locale, value]) => (async () => {
                        const hookedValue = await currentHook({
                            value,
                            originalDoc: doc,
                            data: doc,
                            siblingData: siblingDoc[field.name],
                            operation: 'read',
                            req,
                        });
                        if (hookedValue !== undefined) {
                            siblingDoc[field.name][locale] = hookedValue;
                        }
                    })());
                    await Promise.all(hookPromises);
                }
                else {
                    const hookedValue = await currentHook({
                        data: doc,
                        findMany,
                        originalDoc: doc,
                        operation: 'read',
                        siblingData: siblingDoc[field.name],
                        req,
                        value: siblingDoc[field.name],
                    });
                    if (hookedValue !== undefined) {
                        siblingDoc[field.name] = hookedValue;
                    }
                }
            }, Promise.resolve());
        }
        // Execute access control
        if (field.access && field.access.read) {
            const result = overrideAccess ? true : await field.access.read({ req, id: doc.id, siblingData: siblingDoc, data: doc, doc });
            if (!result) {
                delete siblingDoc[field.name];
            }
        }
        if (field.type === 'relationship' || field.type === 'upload') {
            populationPromises.push((0, relationshipPopulationPromise_1.default)({
                currentDepth,
                depth,
                field,
                overrideAccess,
                req,
                showHiddenFields,
                siblingDoc,
            }));
        }
    }
    switch (field.type) {
        case 'group': {
            let groupDoc = siblingDoc[field.name];
            if (typeof siblingDoc[field.name] !== 'object')
                groupDoc = {};
            (0, traverseFields_1.traverseFields)({
                currentDepth,
                depth,
                doc,
                fieldPromises,
                fields: field.fields,
                findMany,
                flattenLocales,
                overrideAccess,
                populationPromises,
                req,
                siblingDoc: groupDoc,
                showHiddenFields,
            });
            break;
        }
        case 'array': {
            const rows = siblingDoc[field.name];
            if (Array.isArray(rows)) {
                rows.forEach((row, i) => {
                    (0, traverseFields_1.traverseFields)({
                        currentDepth,
                        depth,
                        doc,
                        fields: field.fields,
                        fieldPromises,
                        findMany,
                        flattenLocales,
                        overrideAccess,
                        populationPromises,
                        req,
                        siblingDoc: row || {},
                        showHiddenFields,
                    });
                });
            }
            break;
        }
        case 'blocks': {
            const rows = siblingDoc[field.name];
            if (Array.isArray(rows)) {
                rows.forEach((row, i) => {
                    const block = field.blocks.find((blockType) => blockType.slug === row.blockType);
                    if (block) {
                        (0, traverseFields_1.traverseFields)({
                            currentDepth,
                            depth,
                            doc,
                            fields: block.fields,
                            fieldPromises,
                            findMany,
                            flattenLocales,
                            overrideAccess,
                            populationPromises,
                            req,
                            siblingDoc: row || {},
                            showHiddenFields,
                        });
                    }
                });
            }
            break;
        }
        case 'row':
        case 'collapsible': {
            (0, traverseFields_1.traverseFields)({
                currentDepth,
                depth,
                doc,
                fieldPromises,
                fields: field.fields,
                findMany,
                flattenLocales,
                overrideAccess,
                populationPromises,
                req,
                siblingDoc,
                showHiddenFields,
            });
            break;
        }
        case 'tabs': {
            field.tabs.forEach((tab) => {
                (0, traverseFields_1.traverseFields)({
                    currentDepth,
                    depth,
                    doc,
                    fieldPromises,
                    fields: tab.fields,
                    findMany,
                    flattenLocales,
                    overrideAccess,
                    populationPromises,
                    req,
                    siblingDoc,
                    showHiddenFields,
                });
            });
            break;
        }
        default: {
            break;
        }
    }
};
exports.promise = promise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9maWVsZHMvaG9va3MvYWZ0ZXJSZWFkL3Byb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLDhDQUE2RDtBQUU3RCxxREFBa0Q7QUFDbEQsNkZBQTZFO0FBQzdFLG9HQUE0RTtBQWlCNUUsb0VBQW9FO0FBQ3BFLHVDQUF1QztBQUN2QywwQ0FBMEM7QUFDMUMsOENBQThDO0FBQzlDLHdCQUF3QjtBQUN4QixnQ0FBZ0M7QUFDaEMsMkJBQTJCO0FBRXBCLE1BQU0sT0FBTyxHQUFHLEtBQUssRUFBRSxFQUM1QixZQUFZLEVBQ1osS0FBSyxFQUNMLEdBQUcsRUFDSCxLQUFLLEVBQ0wsYUFBYSxFQUNiLFFBQVEsRUFDUixjQUFjLEVBQ2QsY0FBYyxFQUNkLGtCQUFrQixFQUNsQixHQUFHLEVBQ0gsVUFBVSxFQUNWLGdCQUFnQixHQUNYLEVBQWlCLEVBQUU7O0lBQ3hCLElBQUksSUFBQSx3QkFBZ0IsRUFBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxXQUFXLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtRQUNqSCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDL0I7SUFFRCxNQUFNLGlCQUFpQixHQUFHLGNBQWM7V0FDckMsSUFBQSx3QkFBZ0IsRUFBQyxLQUFLLENBQUM7V0FDdkIsQ0FBQyxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDO1dBQy9FLEtBQUssQ0FBQyxJQUFJO1dBQ1YsS0FBSyxDQUFDLFNBQVM7V0FDZixHQUFHLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQztJQUV4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