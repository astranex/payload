"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promise = void 0;
/* eslint-disable no-param-reassign */
const deepmerge_1 = __importDefault(require("deepmerge"));
const types_1 = require("../../config/types");
const getDefaultValue_1 = __importDefault(require("../../getDefaultValue"));
const traverseFields_1 = require("./traverseFields");
const getExistingRowDoc_1 = require("./getExistingRowDoc");
// This function is responsible for the following actions, in order:
// - Run condition
// - Merge original document data into incoming data
// - Compute default values for undefined fields
// - Execute field hooks
// - Validate data
// - Transform data for storage
// - Unflatten locales
const promise = async ({ data, doc, docWithLocales, errors, field, id, mergeLocaleActions, operation, path, req, siblingData, siblingDoc, siblingDocWithLocales, skipValidation, }) => {
    var _a, _b;
    const passesCondition = ((_a = field.admin) === null || _a === void 0 ? void 0 : _a.condition) ? field.admin.condition(data, siblingData) : true;
    const skipValidationFromHere = skipValidation || !passesCondition;
    if ((0, types_1.fieldAffectsData)(field)) {
        if (typeof siblingData[field.name] === 'undefined') {
            // If no incoming data, but existing document data is found, merge it in
            if (typeof siblingDoc[field.name] !== 'undefined') {
                if (field.localized && typeof siblingDocWithLocales[field.name] === 'object' && siblingDocWithLocales[field.name] !== null) {
                    siblingData[field.name] = siblingDocWithLocales[field.name][req.locale];
                }
                else {
                    siblingData[field.name] = siblingDoc[field.name];
                }
                // Otherwise compute default value
            }
            else if (typeof field.defaultValue !== 'undefined') {
                siblingData[field.name] = await (0, getDefaultValue_1.default)({
                    value: siblingData[field.name],
                    defaultValue: field.defaultValue,
                    locale: req.locale,
                    user: req.user,
                });
            }
        }
        // Execute hooks
        if ((_b = field.hooks) === null || _b === void 0 ? void 0 : _b.beforeChange) {
            await field.hooks.beforeChange.reduce(async (priorHook, currentHook) => {
                await priorHook;
                const hookedValue = await currentHook({
                    value: siblingData[field.name],
                    originalDoc: doc,
                    data,
                    siblingData,
                    operation,
                    req,
                });
                if (hookedValue !== undefined) {
                    siblingData[field.name] = hookedValue;
                }
            }, Promise.resolve());
        }
        // Validate
        if (!skipValidationFromHere && field.validate) {
            let valueToValidate;
            if (['array', 'blocks'].includes(field.type)) {
                const rows = siblingData[field.name];
                valueToValidate = Array.isArray(rows) ? rows.length : 0;
            }
            else {
                valueToValidate = siblingData[field.name];
            }
            const validationResult = await field.validate(valueToValidate, {
                ...field,
                data: (0, deepmerge_1.default)(doc, data, { arrayMerge: (_, source) => source }),
                siblingData: (0, deepmerge_1.default)(siblingDoc, siblingData, { arrayMerge: (_, source) => source }),
                id,
                operation,
                user: req.user,
                payload: req.payload,
            });
            if (typeof validationResult === 'string') {
                errors.push({
                    message: validationResult,
                    field: `${path}${field.name}`,
                });
            }
        }
        // Push merge locale action if applicable
        if (field.localized) {
            mergeLocaleActions.push(() => {
                if (req.payload.config.localization) {
                    const localeData = req.payload.config.localization.locales.reduce((locales, localeID) => {
                        var _a;
                        let valueToSet = siblingData[field.name];
                        if (localeID !== req.locale) {
                            valueToSet = (_a = siblingDocWithLocales === null || siblingDocWithLocales === void 0 ? void 0 : siblingDocWithLocales[field.name]) === null || _a === void 0 ? void 0 : _a[localeID];
                        }
                        if (typeof valueToSet !== 'undefined') {
                            return {
                                ...locales,
                                [localeID]: valueToSet,
                            };
                        }
                        return locales;
                    }, {});
                    // If there are locales with data, set the data
                    if (Object.keys(localeData).length > 0) {
                        siblingData[field.name] = localeData;
                    }
                }
            });
        }
    }
    switch (field.type) {
        case 'point': {
            // Transform point data for storage
            if (Array.isArray(siblingData[field.name]) && siblingData[field.name][0] !== null && siblingData[field.name][1] !== null) {
                siblingData[field.name] = {
                    type: 'Point',
                    coordinates: [
                        parseFloat(siblingData[field.name][0]),
                        parseFloat(siblingData[field.name][1]),
                    ],
                };
            }
            break;
        }
        case 'group': {
            if (typeof siblingData[field.name] !== 'object')
                siblingData[field.name] = {};
            if (typeof siblingDoc[field.name] !== 'object')
                siblingDoc[field.name] = {};
            if (typeof siblingDocWithLocales[field.name] !== 'object')
                siblingDocWithLocales[field.name] = {};
            await (0, traverseFields_1.traverseFields)({
                data,
                doc,
                docWithLocales,
                errors,
                fields: field.fields,
                id,
                mergeLocaleActions,
                operation,
                path: `${path}${field.name}.`,
                req,
                siblingData: siblingData[field.name],
                siblingDoc: siblingDoc[field.name],
                siblingDocWithLocales: siblingDocWithLocales[field.name],
                skipValidation: skipValidationFromHere,
            });
            break;
        }
        case 'array': {
            const rows = siblingData[field.name];
            if (Array.isArray(rows)) {
                const promises = [];
                rows.forEach((row, i) => {
                    var _a, _b;
                    promises.push((0, traverseFields_1.traverseFields)({
                        data,
                        doc,
                        docWithLocales,
                        errors,
                        fields: field.fields,
                        id,
                        mergeLocaleActions,
                        operation,
                        path: `${path}${field.name}.${i}.`,
                        req,
                        siblingData: row,
                        siblingDoc: (0, getExistingRowDoc_1.getExistingRowDoc)(row, (_a = siblingDoc[field.name]) === null || _a === void 0 ? void 0 : _a[i]),
                        siblingDocWithLocales: (0, getExistingRowDoc_1.getExistingRowDoc)(row, (_b = siblingDocWithLocales[field.name]) === null || _b === void 0 ? void 0 : _b[i]),
                        skipValidation: skipValidationFromHere,
                    }));
                });
                await Promise.all(promises);
            }
            break;
        }
        case 'blocks': {
            const rows = siblingData[field.name];
            if (Array.isArray(rows)) {
                const promises = [];
                rows.forEach((row, i) => {
                    var _a, _b;
                    const block = field.blocks.find((blockType) => blockType.slug === row.blockType);
                    if (block) {
                        promises.push((0, traverseFields_1.traverseFields)({
                            data,
                            doc,
                            docWithLocales,
                            errors,
                            fields: block.fields,
                            id,
                            mergeLocaleActions,
                            operation,
                            path: `${path}${field.name}.${i}.`,
                            req,
                            siblingData: row,
                            siblingDoc: (0, getExistingRowDoc_1.getExistingRowDoc)(row, (_a = siblingDoc[field.name]) === null || _a === void 0 ? void 0 : _a[i]),
                            siblingDocWithLocales: (0, getExistingRowDoc_1.getExistingRowDoc)(row, (_b = siblingDocWithLocales[field.name]) === null || _b === void 0 ? void 0 : _b[i]),
                            skipValidation: skipValidationFromHere,
                        }));
                    }
                });
                await Promise.all(promises);
            }
            break;
        }
        case 'row':
        case 'collapsible': {
            await (0, traverseFields_1.traverseFields)({
                data,
                doc,
                docWithLocales,
                errors,
                fields: field.fields,
                id,
                mergeLocaleActions,
                operation,
                path,
                req,
                siblingData,
                siblingDoc,
                siblingDocWithLocales,
                skipValidation: skipValidationFromHere,
            });
            break;
        }
        case 'tabs': {
            const promises = [];
            field.tabs.forEach((tab) => {
                promises.push((0, traverseFields_1.traverseFields)({
                    data,
                    doc,
                    docWithLocales,
                    errors,
                    fields: tab.fields,
                    id,
                    mergeLocaleActions,
                    operation,
                    path,
                    req,
                    siblingData,
                    siblingDoc,
                    siblingDocWithLocales,
                    skipValidation: skipValidationFromHere,
                }));
            });
            await Promise.all(promises);
            break;
        }
        default: {
            break;
        }
    }
};
exports.promise = promise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9maWVsZHMvaG9va3MvYmVmb3JlQ2hhbmdlL3Byb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLDBEQUE4QjtBQUM5Qiw4Q0FBNkQ7QUFHN0QsNEVBQXdEO0FBQ3hELHFEQUFrRDtBQUNsRCwyREFBd0Q7QUFtQnhELG9FQUFvRTtBQUNwRSxrQkFBa0I7QUFDbEIsb0RBQW9EO0FBQ3BELGdEQUFnRDtBQUNoRCx3QkFBd0I7QUFDeEIsa0JBQWtCO0FBQ2xCLCtCQUErQjtBQUMvQixzQkFBc0I7QUFFZixNQUFNLE9BQU8sR0FBRyxLQUFLLEVBQUUsRUFDNUIsSUFBSSxFQUNKLEdBQUcsRUFDSCxjQUFjLEVBQ2QsTUFBTSxFQUNOLEtBQUssRUFDTCxFQUFFLEVBQ0Ysa0JBQWtCLEVBQ2xCLFNBQVMsRUFDVCxJQUFJLEVBQ0osR0FBRyxFQUNILFdBQVcsRUFDWCxVQUFVLEVBQ1YscUJBQXFCLEVBQ3JCLGNBQWMsR0FDVCxFQUFpQixFQUFFOztJQUN4QixNQUFNLGVBQWUsR0FBRyxDQUFDLE1BQUEsS0FBSyxDQUFDLEtBQUssMENBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ25HLE1BQU0sc0JBQXNCLEdBQUcsY0FBYyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBRWxFLElBQUksSUFBQSx3QkFBZ0IsRUFBQyxLQUFLLENBQUMsRUFBRTtRQUMzQixJQUFJLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxXQUFXLEVBQUU7WUFDbEQsd0VBQXdFO1lBQ3hFLElBQUksT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFdBQVcsRUFBRTtn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