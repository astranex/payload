"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recurseRichText = void 0;
const recurseNestedFields_1 = require("./recurseNestedFields");
const populate_1 = require("./populate");
const recurseRichText = ({ req, children, overrideAccess = false, depth, currentDepth = 0, field, promises, showHiddenFields, }) => {
    if (Array.isArray(children)) {
        children.forEach((element) => {
            var _a, _b, _c, _d, _e;
            const collection = req.payload.collections[element === null || element === void 0 ? void 0 : element.relationTo];
            if ((element.type === 'relationship' || element.type === 'upload')
                && ((_a = element === null || element === void 0 ? void 0 : element.value) === null || _a === void 0 ? void 0 : _a.id)
                && collection
                && (depth && currentDepth <= depth)) {
                if (element.type === 'upload' && Array.isArray((_e = (_d = (_c = (_b = field.admin) === null || _b === void 0 ? void 0 : _b.upload) === null || _c === void 0 ? void 0 : _c.collections) === null || _d === void 0 ? void 0 : _d[element === null || element === void 0 ? void 0 : element.relationTo]) === null || _e === void 0 ? void 0 : _e.fields)) {
                    (0, recurseNestedFields_1.recurseNestedFields)({
                        promises,
                        data: element.fields || {},
                        fields: field.admin.upload.collections[element.relationTo].fields,
                        req,
                        overrideAccess,
                        depth,
                        currentDepth,
                        showHiddenFields,
                    });
                }
                promises.push((0, populate_1.populate)({
                    req,
                    id: element.value.id,
                    data: element,
                    key: 'value',
                    overrideAccess,
                    depth,
                    currentDepth,
                    field,
                    collection,
                    showHiddenFields,
                }));
            }
            if (element === null || element === void 0 ? void 0 : element.children) {
                (0, exports.recurseRichText)({
                    children: element.children,
                    currentDepth,
                    depth,
                    field,
                    overrideAccess,
                    promises,
                    req,
                    showHiddenFields,
                });
            }
        });
    }
};
exports.recurseRichText = recurseRichText;
const richTextRelationshipPromise = async ({ currentDepth, depth, field, overrideAccess, req, siblingDoc, showHiddenFields, }) => {
    const promises = [];
    (0, exports.recurseRichText)({
        children: siblingDoc[field.name],
        currentDepth,
        depth,
        field,
        overrideAccess,
        promises,
        req,
        showHiddenFields,
    });
    await Promise.all(promises);
};
exports.default = richTextRelationshipPromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYXRpb25zaGlwUHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9maWVsZHMvcmljaFRleHQvcmVsYXRpb25zaGlwUHJvbWlzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwrREFBNEQ7QUFDNUQseUNBQXNDO0FBdUIvQixNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQzlCLEdBQUcsRUFDSCxRQUFRLEVBQ1IsY0FBYyxHQUFHLEtBQUssRUFDdEIsS0FBSyxFQUNMLFlBQVksR0FBRyxDQUFDLEVBQ2hCLEtBQUssRUFDTCxRQUFRLEVBQ1IsZ0JBQWdCLEdBQ0ksRUFBUSxFQUFFO0lBQzlCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUMxQixRQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFOztZQUN0QyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsVUFBVSxDQUFDLENBQUM7WUFFaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssY0FBYyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO29CQUM3RCxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxLQUFLLDBDQUFFLEVBQUUsQ0FBQTttQkFDbEIsVUFBVTttQkFDVixDQUFDLEtBQUssSUFBSSxZQUFZLElBQUksS0FBSyxDQUFDLEVBQUU7Z0JBQ3JDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFBLE1BQUEsTUFBQSxNQUFBLEtBQUssQ0FBQyxLQUFLLDBDQUFFLE1BQU0sMENBQUUsV0FBVywwQ0FBRyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsVUFBVSxDQUFDLDBDQUFFLE1BQU0sQ0FBQyxFQUFFO29CQUMvRyxJQUFBLHlDQUFtQixFQUFDO3dCQUNsQixRQUFRO3dCQUNSLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUU7d0JBQzFCLE1BQU0sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU07d0JBQ2pFLEdBQUc7d0JBQ0gsY0FBYzt3QkFDZCxLQUFLO3dCQUNMLFlBQVk7d0JBQ1osZ0JBQWdCO3FCQUNqQixDQUFDLENBQUM7aUJBQ0o7Z0JBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFBLG1CQUFRLEVBQUM7b0JBQ3JCLEdBQUc7b0JBQ0gsRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDcEIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsR0FBRyxFQUFFLE9BQU87b0JBQ1osY0FBYztvQkFDZCxLQUFLO29CQUNMLFlBQVk7b0JBQ1osS0FBSztvQkFDTCxVQUFVO29CQUNWLGdCQUFnQjtpQkFDakIsQ0FBQyxDQUFDLENBQUM7YUFDTDtZQUVELElBQUksT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsRUFBRTtnQkFDckIsSUFBQSx1QkFBZSxFQUFDO29CQUNkLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtvQkFDMUIsWUFBWTtvQkFDWixLQUFLO29CQUNMLEtBQUs7b0JBQ0wsY0FBYztvQkFDZCxRQUFRO29CQUNSLEdBQUc7b0JBQ0gsZ0JBQWdCO2lCQUNqQixDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDLENBQUM7QUExRFcsUUFBQSxlQUFlLG1CQTBEMUI7QUFFRixNQUFNLDJCQUEyQixHQUFHLEtBQUssRUFBRSxFQUN6QyxZQUFZLEVBQ1osS0FBSyxFQUNMLEtBQUssRUFDTCxjQUFjLEVBQ2QsR0FBRyxFQUNILFVBQVUsRUFDVixnQkFBZ0IsR0FDWCxFQUFpQixFQUFFO0lBQ3hCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUVwQixJQUFBLHVCQUFlLEVBQUM7UUFDZCxRQUFRLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQWM7UUFDN0MsWUFBWTtRQUNaLEtBQUs7UUFDTCxLQUFLO1FBQ0wsY0FBYztRQUNkLFFBQVE7UUFDUixHQUFHO1FBQ0gsZ0JBQWdCO0tBQ2pCLENBQUMsQ0FBQztJQUVILE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QixDQUFDLENBQUM7QUFFRixrQkFBZSwyQkFBMkIsQ0FBQyJ9