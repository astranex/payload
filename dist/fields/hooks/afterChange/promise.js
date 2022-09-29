"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promise = void 0;
const types_1 = require("../../config/types");
const traverseFields_1 = require("./traverseFields");
// This function is responsible for the following actions, in order:
// - Execute field hooks
const promise = async ({ data, doc, field, operation, req, siblingData, siblingDoc, }) => {
    var _a;
    if ((0, types_1.fieldAffectsData)(field)) {
        // Execute hooks
        if ((_a = field.hooks) === null || _a === void 0 ? void 0 : _a.afterChange) {
            await field.hooks.afterChange.reduce(async (priorHook, currentHook) => {
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
                    siblingDoc[field.name] = hookedValue;
                }
            }, Promise.resolve());
        }
    }
    // Traverse subfields
    switch (field.type) {
        case 'group': {
            await (0, traverseFields_1.traverseFields)({
                data,
                doc,
                fields: field.fields,
                operation,
                req,
                siblingData: siblingData[field.name] || {},
                siblingDoc: siblingDoc[field.name],
            });
            break;
        }
        case 'array': {
            const rows = siblingDoc[field.name];
            if (Array.isArray(rows)) {
                const promises = [];
                rows.forEach((row, i) => {
                    var _a;
                    promises.push((0, traverseFields_1.traverseFields)({
                        data,
                        doc,
                        fields: field.fields,
                        operation,
                        req,
                        siblingData: ((_a = siblingData[field.name]) === null || _a === void 0 ? void 0 : _a[i]) || {},
                        siblingDoc: { ...row } || {},
                    }));
                });
                await Promise.all(promises);
            }
            break;
        }
        case 'blocks': {
            const rows = siblingDoc[field.name];
            if (Array.isArray(rows)) {
                const promises = [];
                rows.forEach((row, i) => {
                    var _a;
                    const block = field.blocks.find((blockType) => blockType.slug === row.blockType);
                    if (block) {
                        promises.push((0, traverseFields_1.traverseFields)({
                            data,
                            doc,
                            fields: block.fields,
                            operation,
                            req,
                            siblingData: ((_a = siblingData[field.name]) === null || _a === void 0 ? void 0 : _a[i]) || {},
                            siblingDoc: { ...row } || {},
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
                fields: field.fields,
                operation,
                req,
                siblingData: siblingData || {},
                siblingDoc: { ...siblingDoc },
            });
            break;
        }
        case 'tabs': {
            const promises = [];
            field.tabs.forEach((tab) => {
                promises.push((0, traverseFields_1.traverseFields)({
                    data,
                    doc,
                    fields: tab.fields,
                    operation,
                    req,
                    siblingData: siblingData || {},
                    siblingDoc: { ...siblingDoc },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9maWVsZHMvaG9va3MvYWZ0ZXJDaGFuZ2UvcHJvbWlzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSw4Q0FBNkQ7QUFDN0QscURBQWtEO0FBWWxELG9FQUFvRTtBQUNwRSx3QkFBd0I7QUFFakIsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLEVBQzVCLElBQUksRUFDSixHQUFHLEVBQ0gsS0FBSyxFQUNMLFNBQVMsRUFDVCxHQUFHLEVBQ0gsV0FBVyxFQUNYLFVBQVUsR0FDTCxFQUFpQixFQUFFOztJQUN4QixJQUFJLElBQUEsd0JBQWdCLEVBQUMsS0FBSyxDQUFDLEVBQUU7UUFDM0IsZ0JBQWdCO1FBQ2hCLElBQUksTUFBQSxLQUFLLENBQUMsS0FBSywwQ0FBRSxXQUFXLEVBQUU7WUFDNUIsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRTtnQkFDcEUsTUFBTSxTQUFTLENBQUM7Z0JBRWhCLE1BQU0sV0FBVyxHQUFHLE1BQU0sV0FBVyxDQUFDO29CQUNwQyxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7b0JBQzlCLFdBQVcsRUFBRSxHQUFHO29CQUNoQixJQUFJO29CQUNKLFdBQVc7b0JBQ1gsU0FBUztvQkFDVCxHQUFHO2lCQUNKLENBQUMsQ0FBQztnQkFFSCxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUU7b0JBQzdCLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDO2lCQUN0QztZQUNILENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUN2QjtLQUNGO0lBRUQscUJBQXFCO0lBQ3JCLFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNsQixLQUFLLE9BQU8sQ0FBQyxD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