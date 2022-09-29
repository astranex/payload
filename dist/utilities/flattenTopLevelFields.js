"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../fields/config/types");
const flattenFields = (fields, keepPresentationalFields) => {
    return fields.reduce((fieldsToUse, field) => {
        if ((0, types_1.fieldAffectsData)(field) || (keepPresentationalFields && (0, types_1.fieldIsPresentationalOnly)(field))) {
            return [
                ...fieldsToUse,
                field,
            ];
        }
        if ((0, types_1.fieldHasSubFields)(field)) {
            return [
                ...fieldsToUse,
                ...flattenFields(field.fields, keepPresentationalFields),
            ];
        }
        if (field.type === 'tabs') {
            return [
                ...fieldsToUse,
                ...field.tabs.reduce((tabFields, tab) => {
                    return [
                        ...tabFields,
                        ...flattenFields(tab.fields, keepPresentationalFields),
                    ];
                }, []),
            ];
        }
        return fieldsToUse;
    }, []);
};
exports.default = flattenFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdHRlblRvcExldmVsRmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdGllcy9mbGF0dGVuVG9wTGV2ZWxGaWVsZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrREFBNEo7QUFFNUosTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFlLEVBQUUsd0JBQWtDLEVBQW9ELEVBQUU7SUFDOUgsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQzFDLElBQUksSUFBQSx3QkFBZ0IsRUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHdCQUF3QixJQUFJLElBQUEsaUNBQXlCLEVBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM3RixPQUFPO2dCQUNMLEdBQUcsV0FBVztnQkFDZCxLQUFLO2FBQ04sQ0FBQztTQUNIO1FBRUQsSUFBSSxJQUFBLHlCQUFpQixFQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLE9BQU87Z0JBQ0wsR0FBRyxXQUFXO2dCQUNkLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsd0JBQXdCLENBQUM7YUFDekQsQ0FBQztTQUNIO1FBRUQsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtZQUN6QixPQUFPO2dCQUNMLEdBQUcsV0FBVztnQkFDZCxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFFO29CQUN0QyxPQUFPO3dCQUNMLEdBQUcsU0FBUzt3QkFDWixHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLHdCQUF3QixDQUFDO3FCQUN2RCxDQUFDO2dCQUNKLENBQUMsRUFBRSxFQUFFLENBQUM7YUFDUCxDQUFDO1NBQ0g7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDLENBQUM7QUFFRixrQkFBZSxhQUFhLENBQUMifQ==