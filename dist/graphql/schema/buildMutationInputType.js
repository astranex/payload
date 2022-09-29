"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionIDType = void 0;
/* eslint-disable no-use-before-define */
const graphql_1 = require("graphql");
const graphql_type_json_1 = require("graphql-type-json");
const withNullableType_1 = __importDefault(require("./withNullableType"));
const formatName_1 = __importDefault(require("../utilities/formatName"));
const combineParentName_1 = __importDefault(require("../utilities/combineParentName"));
const types_1 = require("../../fields/config/types");
const formatLabels_1 = require("../../utilities/formatLabels");
const getCollectionIDType = (config) => {
    const idField = config.fields.find((field) => (0, types_1.fieldAffectsData)(field) && field.name === 'id');
    if (!idField)
        return graphql_1.GraphQLString;
    switch (idField.type) {
        case 'number':
            return graphql_1.GraphQLInt;
        default:
            return graphql_1.GraphQLString;
    }
};
exports.getCollectionIDType = getCollectionIDType;
function buildMutationInputType(payload, name, fields, parentName, forceNullable = false) {
    const fieldToSchemaMap = {
        number: (inputObjectTypeConfig, field) => {
            const type = field.name === 'id' ? graphql_1.GraphQLInt : graphql_1.GraphQLFloat;
            return {
                ...inputObjectTypeConfig,
                [field.name]: { type: (0, withNullableType_1.default)(field, type, forceNullable) },
            };
        },
        text: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        email: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        textarea: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        richText: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_type_json_1.GraphQLJSON, forceNullable) },
        }),
        code: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        date: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        upload: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        radio: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        point: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, (0, graphql_1.GraphQLList)(graphql_1.GraphQLFloat), forceNullable) },
        }),
        checkbox: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: graphql_1.GraphQLBoolean },
        }),
        select: (inputObjectTypeConfig, field) => {
            const formattedName = `${(0, combineParentName_1.default)(parentName, field.name)}_MutationInput`;
            let type = new graphql_1.GraphQLEnumType({
                name: formattedName,
                values: field.options.reduce((values, option) => {
                    if (typeof option === 'object' && option.value) {
                        return {
                            ...values,
                            [(0, formatName_1.default)(option.value)]: {
                                value: option.value,
                            },
                        };
                    }
                    if (typeof option === 'string') {
                        return {
                            ...values,
                            [option]: {
                                value: option,
                            },
                        };
                    }
                    return values;
                }, {}),
            });
            type = field.hasMany ? new graphql_1.GraphQLList(type) : type;
            type = (0, withNullableType_1.default)(field, type, forceNullable);
            return {
                ...inputObjectTypeConfig,
                [field.name]: { type },
            };
        },
        relationship: (inputObjectTypeConfig, field) => {
            const { relationTo } = field;
            let type;
            if (Array.isArray(relationTo)) {
                const fullName = `${(0, combineParentName_1.default)(parentName, field.label === false ? (0, formatLabels_1.toWords)(field.name, true) : field.label)}RelationshipInput`;
                type = new graphql_1.GraphQLInputObjectType({
                    name: fullName,
                    fields: {
                        relationTo: {
                            type: new graphql_1.GraphQLEnumType({
                                name: `${fullName}RelationTo`,
                                values: relationTo.reduce((values, option) => ({
                                    ...values,
                                    [(0, formatName_1.default)(option)]: {
                                        value: option,
                                    },
                                }), {}),
                            }),
                        },
                        value: { type: graphql_type_json_1.GraphQLJSON },
                    },
                });
            }
            else {
                type = (0, exports.getCollectionIDType)(payload.collections[relationTo].config);
            }
            return {
                ...inputObjectTypeConfig,
                [field.name]: { type: field.hasMany ? new graphql_1.GraphQLList(type) : type },
            };
        },
        array: (inputObjectTypeConfig, field) => {
            const fullName = (0, combineParentName_1.default)(parentName, field.label === false ? (0, formatLabels_1.toWords)(field.name, true) : field.label);
            let type = buildMutationInputType(payload, fullName, field.fields, fullName);
            type = new graphql_1.GraphQLList((0, withNullableType_1.default)(field, type, forceNullable));
            return {
                ...inputObjectTypeConfig,
                [field.name]: { type },
            };
        },
        group: (inputObjectTypeConfig, field) => {
            const requiresAtLeastOneField = field.fields.some((subField) => (!(0, types_1.fieldIsPresentationalOnly)(subField) && subField.required && !subField.localized));
            const fullName = (0, combineParentName_1.default)(parentName, field.label === false ? (0, formatLabels_1.toWords)(field.name, true) : field.label);
            let type = buildMutationInputType(payload, fullName, field.fields, fullName);
            if (requiresAtLeastOneField)
                type = new graphql_1.GraphQLNonNull(type);
            return {
                ...inputObjectTypeConfig,
                [field.name]: { type },
            };
        },
        blocks: (inputObjectTypeConfig, field) => ({
            ...inputObjectTypeConfig,
            [field.name]: { type: graphql_type_json_1.GraphQLJSON },
        }),
        row: (inputObjectTypeConfig, field) => field.fields.reduce((acc, subField) => {
            const addSubField = fieldToSchemaMap[subField.type];
            if (addSubField)
                return addSubField(acc, subField);
            return acc;
        }, inputObjectTypeConfig),
        collapsible: (inputObjectTypeConfig, field) => field.fields.reduce((acc, subField) => {
            const addSubField = fieldToSchemaMap[subField.type];
            if (addSubField)
                return addSubField(acc, subField);
            return acc;
        }, inputObjectTypeConfig),
        tabs: (inputObjectTypeConfig, field) => field.tabs.reduce((acc, tab) => {
            return {
                ...acc,
                ...tab.fields.reduce((subFieldSchema, subField) => {
                    const addSubField = fieldToSchemaMap[subField.type];
                    if (addSubField)
                        return addSubField(subFieldSchema, subField);
                    return subFieldSchema;
                }, acc),
            };
        }, inputObjectTypeConfig),
    };
    const fieldName = (0, formatName_1.default)(name);
    return new graphql_1.GraphQLInputObjectType({
        name: `mutation${fieldName}Input`,
        fields: fields.reduce((inputObjectTypeConfig, field) => {
            const fieldSchema = fieldToSchemaMap[field.type];
            if (typeof fieldSchema !== 'function') {
                return inputObjectTypeConfig;
            }
            return {
                ...inputObjectTypeConfig,
                ...fieldSchema(inputObjectTypeConfig, field),
            };
        }, {}),
    });
}
exports.default = buildMutationInputType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRNdXRhdGlvbklucHV0VHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9idWlsZE11dGF0aW9uSW5wdXRUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHlDQUF5QztBQUN6QyxxQ0FZaUI7QUFDakIseURBQWdEO0FBQ2hELDBFQUFrRDtBQUNsRCx5RUFBaUQ7QUFDakQsdUZBQStEO0FBQy9ELHFEQUFzVjtBQUN0ViwrREFBdUQ7QUFJaEQsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLE1BQWlDLEVBQXFCLEVBQUU7SUFDMUYsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUEsd0JBQWdCLEVBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztJQUM5RixJQUFJLENBQUMsT0FBTztRQUFFLE9BQU8sdUJBQWEsQ0FBQztJQUNuQyxRQUFRLE9BQU8sQ0FBQyxJQUFJLEVBQUU7UUFDcEIsS0FBSyxRQUFRO1lBQ1gsT0FBTyxvQkFBVSxDQUFDO1FBQ3BCO1lBQ0UsT0FBTyx1QkFBYSxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQyxDQUFDO0FBVFcsUUFBQSxtQkFBbUIsdUJBUzlCO0FBTUYsU0FBUyxzQkFBc0IsQ0FBQyxPQUFnQixFQUFFLElBQVksRUFBRSxNQUFlLEVBQUUsVUFBa0IsRUFBRSxhQUFhLEdBQUcsS0FBSztJQUN4SCxNQUFNLGdCQUFnQixHQUFHO1FBQ3ZCLE1BQU0sRUFBRSxDQUFDLHFCQUE0QyxFQUFFLEtBQWtCLEVBQUUsRUFBRTtZQUMzRSxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsb0JBQVUsQ0FBQyxDQUFDLENBQUMsc0JBQVksQ0FBQztZQUM3RCxPQUFPO2dCQUNMLEdBQUcscUJBQXFCO2dCQUN4QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFBLDBCQUFnQixFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLEVBQUU7YUFDckUsQ0FBQztRQUNKLENBQUM7UUFDRCxJQUFJLEVBQUUsQ0FBQyxxQkFBNEMsRUFBRSxLQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3pFLEdBQUcscUJBQXFCO1lBQ3hCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUEsMEJBQWdCLEVBQUMsS0FBSyxFQUFFLHVCQUFhLEVBQUUsYUFBYSxDQUFDLEVBQUU7U0FDOUUsQ0FBQztRQUNGLEtBQUssRUFBRSxDQUFDLHFCQUE0QyxFQUFFLEtBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0UsR0FBRyxxQkFBcUI7WUFDeEIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBQSwwQkFBZ0IsRUFBQyxLQUFLLEVBQUUsdUJBQWEsRUFBRSxhQUFhLENBQUMsRUFBRTtTQUM5RSxDQUFDO1FBQ0YsUUFBUSxFQUFFLENBQUMscUJBQTRDLEVBQUUsS0FBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqRixHQUFHLHFCQUFxQjtZQUN4QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFBLDBCQUFnQixFQUFDLEtBQUssRUFBRSx1QkFBYSxFQUFFLGFBQWEsQ0FBQyxFQUFFO1NBQzlFLENBQUM7UUFDRixRQUFRLEVBQUUsQ0FBQyxxQkFBNEMsRUFBRSxLQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pGLEdBQUcscUJBQXFCO1lBQ3hCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUEsMEJBQWdCLEVBQUMsS0FBSyxFQUFFLCtCQUFXLEVBQUUsYUFBYSxDQUFDLEVBQUU7U0FDNUUsQ0FBQztRQUNGLElBQUksRUFBRSxDQUFDLHFCQUE0QyxFQUFFLEtBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDekUsR0FBRyxxQkFBcUI7WUFDeEIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBQSwwQkFBZ0IsRUFBQyxLQUFLLEVBQUUsdUJBQWEsRUFBRSxhQUFhLENBQUMsRUFBRTtTQUM5RSxDQUFDO1FBQ0YsSUFBSSxFQUFFLENBQUMscUJBQTRDLEVBQUUsS0FBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6RSxHQUFHLHFCQUFxQjtZQUN4QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFBLDBCQUFnQixFQUFDLEtBQUssRUFBRSx1QkFBYSxFQUFFLGFBQWEsQ0FBQyxFQUFFO1NBQzlFLENBQUM7UUFDRixNQUFNLEVBQUUsQ0FBQyxxQkFBNEMsRUFBRSxLQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzdFLEdBQUcscUJBQXFCO1lBQ3hCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUEsMEJBQWdCLEVBQUMsS0FBSyxFQUFFLHVCQUFhLEVBQUUsYUFBYSxDQUFDLEVBQUU7U0FDOUUsQ0FBQztRQUNGLEtBQUssRUFBRSxDQUFDLHFCQUE0QyxFQUFFLEtBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0UsR0FBRyxxQkFBcUI7WUFDeEIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBQSwwQkFBZ0IsRUFBQyxLQUFLLEVBQUUsdUJBQWEsRUFBRSxhQUFhLENBQUMsRUFBRTtTQUM5RSxDQUFDO1FBQ0YsS0FBSyxFQUFFLENBQUMscUJBQTRDLEVBQUUsS0FBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzRSxHQUFHLHFCQUFxQjtZQUN4QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFBLDBCQUFnQixFQUFDLEtBQUssRUFBRSxJQUFBLHFCQUFXLEVBQUMsc0JBQVksQ0FBQyxFQUFFLGFBQWEsQ0FBQyxFQUFFO1NBQzFGLENBQUM7UUFDRixRQUFRLEVBQUUsQ0FBQyxxQkFBNEMsRUFBRSxLQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pGLEdBQUcscUJBQXFCO1lBQ3hCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLHdCQUFjLEVBQUU7U0FDdkMsQ0FBQztRQUNGLE1BQU0sRUFBRSxDQUFDLHFCQUE0QyxFQUFFLEtBQWtCLEVBQUUsRUFBRTtZQUMzRSxNQUFNLGFBQWEsR0FBRyxHQUFHLElBQUEsMkJBQWlCLEVBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDbkYsSUFBSSxJQUFJLEdBQWdCLElBQUkseUJBQWUsQ0FBQztnQkFDMUMsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRTtvQkFDOUMsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTt3QkFDOUMsT0FBTzs0QkFDTCxHQUFHLE1BQU07NEJBQ1QsQ0FBQyxJQUFBLG9CQUFVLEVBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0NBQzFCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSzs2QkFDcEI7eUJBQ0YsQ0FBQztxQkFDSDtvQkFFRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTt3QkFDOUIsT0FBTzs0QkFDTCxHQUFHLE1BQU07NEJBQ1QsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQ0FDUixLQUFLLEVBQUUsTUFBTTs2QkFDZDt5QkFDRixDQUFDO3FCQUNIO29CQUVELE9BQU8sTUFBTSxDQUFDO2dCQUNoQixDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ1AsQ0FBQyxDQUFDO1lBRUgsSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUkscUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3BELElBQUksR0FBRyxJQUFBLDBCQUFnQixFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFcEQsT0FBTztnQkFDTCxHQUFHLHFCQUFxQjtnQkFDeEIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUU7YUFDdkIsQ0FBQztRQUNKLENBQUM7UUFDRCxZQUFZLEVBQUUsQ0FBQyxxQkFBNEMsRUFBRSxLQUF3QixFQUFFLEVBQUU7WUFDdkYsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUU3QixJQUFJLElBQW9DLENBQUM7WUFFekMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUM3QixNQUFNLFFBQVEsR0FBRyxHQUFHLElBQUEsMkJBQWlCLEVBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFBLHNCQUFPLEVBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztnQkFDdEksSUFBSSxHQUFHLElBQUksZ0NBQXNCLENBQUM7b0JBQ2hDLElBQUksRUFBRSxRQUFRO29CQUNkLE1BQU0sRUFBRTt3QkFDTixVQUFVLEVBQUU7NEJBQ1YsSUFBSSxFQUFFLElBQUkseUJBQWUsQ0FBQztnQ0FDeEIsSUFBSSxFQUFFLEdBQUcsUUFBUSxZQUFZO2dDQUM3QixNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7b0NBQzdDLEdBQUcsTUFBTTtvQ0FDVCxDQUFDLElBQUEsb0JBQVUsRUFBQyxNQUFNLENBQUMsQ0FBQyxFQUFFO3dDQUNwQixLQUFLLEVBQUUsTUFBTTtxQ0FDZDtpQ0FDRixDQUFDLEVBQUUsRUFBRSxDQUFDOzZCQUNSLENBQUM7eUJBQ0g7d0JBQ0QsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLCtCQUFXLEVBQUU7cUJBQzdCO2lCQUNGLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLElBQUksR0FBRyxJQUFBLDJCQUFtQixFQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDcEU7WUFFRCxPQUFPO2dCQUNMLEdBQUcscUJBQXFCO2dCQUN4QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLHFCQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRTthQUNyRSxDQUFDO1FBQ0osQ0FBQztRQUNELEtBQUssRUFBRSxDQUFDLHFCQUE0QyxFQUFFLEtBQWlCLEVBQUUsRUFBRTtZQUN6RSxNQUFNLFFBQVEsR0FBRyxJQUFBLDJCQUFpQixFQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBQSxzQkFBTyxFQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoSCxJQUFJLElBQUksR0FBMkMsc0JBQXNCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3JILElBQUksR0FBRyxJQUFJLHFCQUFXLENBQUMsSUFBQSwwQkFBZ0IsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDckUsT0FBTztnQkFDTCxHQUFHLHFCQUFxQjtnQkFDeEIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUU7YUFDdkIsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLEVBQUUsQ0FBQyxxQkFBNEMsRUFBRSxLQUFpQixFQUFFLEVBQUU7WUFDekUsTUFBTSx1QkFBdUIsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUEsaUNBQXlCLEVBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BKLE1BQU0sUUFBUSxHQUFHLElBQUEsMkJBQWlCLEVBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFBLHNCQUFPLEVBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hILElBQUksSUFBSSxHQUFnQixzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDMUYsSUFBSSx1QkFBdUI7Z0JBQUUsSUFBSSxHQUFHLElBQUksd0JBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3RCxPQUFPO2dCQUNMLEdBQUcscUJBQXFCO2dCQUN4QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRTthQUN2QixDQUFDO1FBQ0osQ0FBQztRQUNELE1BQU0sRUFBRSxDQUFDLHFCQUE0QyxFQUFFLEtBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUUsR0FBRyxxQkFBcUI7WUFDeEIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsK0JBQVcsRUFBRTtTQUNwQyxDQUFDO1FBQ0YsR0FBRyxFQUFFLENBQUMscUJBQTRDLEVBQUUsS0FBZSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxRQUFlLEVBQUUsRUFBRTtZQUNuSCxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEQsSUFBSSxXQUFXO2dCQUFFLE9BQU8sV0FBVyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNuRCxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsRUFBRSxxQkFBcUIsQ0FBQztRQUN6QixXQUFXLEVBQUUsQ0FBQyxxQkFBNEMsRUFBRSxLQUF1QixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxRQUEwQixFQUFFLEVBQUU7WUFDOUksTUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BELElBQUksV0FBVztnQkFBRSxPQUFPLFdBQVcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDbkQsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLEVBQUUscUJBQXFCLENBQUM7UUFDekIsSUFBSSxFQUFFLENBQUMscUJBQTRDLEVBQUUsS0FBZ0IsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDdkcsT0FBTztnQkFDTCxHQUFHLEdBQUc7Z0JBQ04sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsRUFBRTtvQkFDaEQsTUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwRCxJQUFJLFdBQVc7d0JBQUUsT0FBTyxXQUFXLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUM5RCxPQUFPLGNBQWMsQ0FBQztnQkFDeEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQzthQUNSLENBQUM7UUFDSixDQUFDLEVBQUUscUJBQXFCLENBQUM7S0FDMUIsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLElBQUEsb0JBQVUsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUVuQyxPQUFPLElBQUksZ0NBQXNCLENBQUM7UUFDaEMsSUFBSSxFQUFFLFdBQVcsU0FBUyxPQUFPO1FBQ2pDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDckQsTUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWpELElBQUksT0FBTyxXQUFXLEtBQUssVUFBVSxFQUFFO2dCQUNyQyxPQUFPLHFCQUFxQixDQUFDO2FBQzlCO1lBRUQsT0FBTztnQkFDTCxHQUFHLHFCQUFxQjtnQkFDeEIsR0FBRyxXQUFXLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDO2FBQzdDLENBQUM7UUFDSixDQUFDLEVBQUUsRUFBRSxDQUFDO0tBQ1AsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELGtCQUFlLHNCQUFzQixDQUFDIn0=