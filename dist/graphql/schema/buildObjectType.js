"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
const graphql_type_json_1 = require("graphql-type-json");
const graphql_1 = require("graphql");
const graphql_scalars_1 = require("graphql-scalars");
const formatName_1 = __importDefault(require("../utilities/formatName"));
const combineParentName_1 = __importDefault(require("../utilities/combineParentName"));
const withNullableType_1 = __importDefault(require("./withNullableType"));
const formatLabels_1 = require("../../utilities/formatLabels");
const relationshipPromise_1 = __importDefault(require("../../fields/richText/relationshipPromise"));
const formatOptions_1 = __importDefault(require("../utilities/formatOptions"));
const buildWhereInputType_1 = __importDefault(require("./buildWhereInputType"));
const buildBlockType_1 = __importDefault(require("./buildBlockType"));
const isFieldNullable_1 = __importDefault(require("./isFieldNullable"));
function buildObjectType({ payload, name, fields, parentName, baseFields = {}, forceNullable, }) {
    const fieldToSchemaMap = {
        number: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLFloat, forceNullable) },
        }),
        text: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        email: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_scalars_1.EmailAddressResolver, forceNullable) },
        }),
        textarea: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        code: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLString, forceNullable) },
        }),
        date: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_scalars_1.DateTimeResolver, forceNullable) },
        }),
        point: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(graphql_1.GraphQLFloat)), forceNullable) },
        }),
        richText: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: {
                type: (0, withNullableType_1.default)(field, graphql_type_json_1.GraphQLJSON, forceNullable),
                async resolve(parent, args, context) {
                    if (args.depth > 0) {
                        await (0, relationshipPromise_1.default)({
                            req: context.req,
                            siblingDoc: parent,
                            depth: args.depth,
                            field,
                            showHiddenFields: false,
                        });
                    }
                    return parent[field.name];
                },
                args: {
                    depth: {
                        type: graphql_1.GraphQLInt,
                    },
                },
            },
        }),
        upload: (objectTypeConfig, field) => {
            const { relationTo, label } = field;
            const uploadName = (0, combineParentName_1.default)(parentName, label === false ? (0, formatLabels_1.toWords)(field.name, true) : label);
            // If the relationshipType is undefined at this point,
            // it can be assumed that this blockType can have a relationship
            // to itself. Therefore, we set the relationshipType equal to the blockType
            // that is currently being created.
            const type = payload.collections[relationTo].graphQL.type || newlyCreatedBlockType;
            const uploadArgs = {};
            if (payload.config.localization) {
                uploadArgs.locale = {
                    type: payload.types.localeInputType,
                };
                uploadArgs.fallbackLocale = {
                    type: payload.types.fallbackLocaleInputType,
                };
            }
            const relatedCollectionSlug = field.relationTo;
            const upload = {
                args: uploadArgs,
                type,
                extensions: { complexity: 20 },
                async resolve(parent, args, context) {
                    const value = parent[field.name];
                    const locale = args.locale || context.req.locale;
                    const fallbackLocale = args.fallbackLocale || context.req.fallbackLocale;
                    const id = value;
                    if (id) {
                        const relatedDocument = await context.req.payloadDataLoader.load(JSON.stringify([
                            relatedCollectionSlug,
                            id,
                            0,
                            0,
                            locale,
                            fallbackLocale,
                            false,
                            false,
                        ]));
                        return relatedDocument || null;
                    }
                    return null;
                },
            };
            const whereFields = payload.collections[relationTo].config.fields;
            upload.args.where = {
                type: (0, buildWhereInputType_1.default)(uploadName, whereFields, uploadName),
            };
            return {
                ...objectTypeConfig,
                [field.name]: upload,
            };
        },
        radio: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: {
                type: (0, withNullableType_1.default)(field, new graphql_1.GraphQLEnumType({
                    name: (0, combineParentName_1.default)(parentName, field.name),
                    values: (0, formatOptions_1.default)(field),
                }), forceNullable),
            },
        }),
        checkbox: (objectTypeConfig, field) => ({
            ...objectTypeConfig,
            [field.name]: { type: (0, withNullableType_1.default)(field, graphql_1.GraphQLBoolean, forceNullable) },
        }),
        select: (objectTypeConfig, field) => {
            const fullName = (0, combineParentName_1.default)(parentName, field.name);
            let type = new graphql_1.GraphQLEnumType({
                name: fullName,
                values: (0, formatOptions_1.default)(field),
            });
            type = field.hasMany ? new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(type)) : type;
            type = (0, withNullableType_1.default)(field, type, forceNullable);
            return {
                ...objectTypeConfig,
                [field.name]: { type },
            };
        },
        relationship: (objectTypeConfig, field) => {
            const { relationTo, label } = field;
            const isRelatedToManyCollections = Array.isArray(relationTo);
            const hasManyValues = field.hasMany;
            const relationshipName = (0, combineParentName_1.default)(parentName, label === false ? (0, formatLabels_1.toWords)(field.name, true) : label);
            let type;
            let relationToType = null;
            if (Array.isArray(relationTo)) {
                relationToType = new graphql_1.GraphQLEnumType({
                    name: `${relationshipName}_RelationTo`,
                    values: relationTo.reduce((relations, relation) => ({
                        ...relations,
                        [(0, formatName_1.default)(relation)]: {
                            value: relation,
                        },
                    }), {}),
                });
                const types = relationTo.map((relation) => payload.collections[relation].graphQL.type);
                type = new graphql_1.GraphQLObjectType({
                    name: `${relationshipName}_Relationship`,
                    fields: {
                        relationTo: {
                            type: relationToType,
                        },
                        value: {
                            type: new graphql_1.GraphQLUnionType({
                                name: relationshipName,
                                types,
                                async resolveType(data, { req }) {
                                    return payload.collections[data.collection].graphQL.type.name;
                                },
                            }),
                        },
                    },
                });
            }
            else {
                ({ type } = payload.collections[relationTo].graphQL);
            }
            // If the relationshipType is undefined at this point,
            // it can be assumed that this blockType can have a relationship
            // to itself. Therefore, we set the relationshipType equal to the blockType
            // that is currently being created.
            type = type || newlyCreatedBlockType;
            const relationshipArgs = {};
            if (payload.config.localization) {
                relationshipArgs.locale = {
                    type: payload.types.localeInputType,
                };
                relationshipArgs.fallbackLocale = {
                    type: payload.types.fallbackLocaleInputType,
                };
            }
            const relationship = {
                args: relationshipArgs,
                type: hasManyValues ? new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(type)) : type,
                extensions: { complexity: 10 },
                async resolve(parent, args, context) {
                    const value = parent[field.name];
                    const locale = args.locale || context.req.locale;
                    const fallbackLocale = args.fallbackLocale || context.req.fallbackLocale;
                    let relatedCollectionSlug = field.relationTo;
                    if (hasManyValues) {
                        const results = [];
                        const resultPromises = [];
                        const createPopulationPromise = async (relatedDoc, i) => {
                            let id = relatedDoc;
                            let collectionSlug = field.relationTo;
                            if (isRelatedToManyCollections) {
                                collectionSlug = relatedDoc.relationTo;
                                id = relatedDoc.value;
                            }
                            const result = await context.req.payloadDataLoader.load(JSON.stringify([
                                collectionSlug,
                                id,
                                0,
                                0,
                                locale,
                                fallbackLocale,
                                false,
                                false,
                            ]));
                            if (result) {
                                if (isRelatedToManyCollections) {
                                    results[i] = {
                                        relationTo: collectionSlug,
                                        value: {
                                            ...result,
                                            collection: collectionSlug,
                                        },
                                    };
                                }
                                else {
                                    results[i] = result;
                                }
                            }
                        };
                        if (value) {
                            value.forEach((relatedDoc, i) => {
                                resultPromises.push(createPopulationPromise(relatedDoc, i));
                            });
                        }
                        await Promise.all(resultPromises);
                        return results;
                    }
                    let id = value;
                    if (isRelatedToManyCollections && value) {
                        id = value.value;
                        relatedCollectionSlug = value.relationTo;
                    }
                    if (id) {
                        id = id.toString();
                        const relatedDocument = await context.req.payloadDataLoader.load(JSON.stringify([
                            relatedCollectionSlug,
                            id,
                            0,
                            0,
                            locale,
                            fallbackLocale,
                            false,
                            false,
                        ]));
                        if (relatedDocument) {
                            if (isRelatedToManyCollections) {
                                return {
                                    relationTo: relatedCollectionSlug,
                                    value: {
                                        ...relatedDocument,
                                        collection: relatedCollectionSlug,
                                    },
                                };
                            }
                            return relatedDocument;
                        }
                        return null;
                    }
                    return null;
                },
            };
            return {
                ...objectTypeConfig,
                [field.name]: relationship,
            };
        },
        array: (objectTypeConfig, field) => {
            const fullName = (0, combineParentName_1.default)(parentName, field.label === false ? (0, formatLabels_1.toWords)(field.name, true) : field.label);
            const type = buildObjectType({
                payload,
                name: fullName,
                fields: field.fields,
                parentName: fullName,
                forceNullable: (0, isFieldNullable_1.default)(field, forceNullable),
            });
            const arrayType = new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(type));
            return {
                ...objectTypeConfig,
                [field.name]: { type: (0, withNullableType_1.default)(field, arrayType) },
            };
        },
        group: (objectTypeConfig, field) => {
            const fullName = (0, combineParentName_1.default)(parentName, field.label === false ? (0, formatLabels_1.toWords)(field.name, true) : field.label);
            const type = buildObjectType({
                payload,
                name: fullName,
                parentName: fullName,
                fields: field.fields,
                forceNullable: (0, isFieldNullable_1.default)(field, forceNullable),
            });
            return {
                ...objectTypeConfig,
                [field.name]: { type },
            };
        },
        blocks: (objectTypeConfig, field) => {
            const blockTypes = field.blocks.map((block) => {
                (0, buildBlockType_1.default)({
                    payload,
                    block,
                    forceNullable: (0, isFieldNullable_1.default)(field, forceNullable),
                });
                return payload.types.blockTypes[block.slug];
            });
            const fullName = (0, combineParentName_1.default)(parentName, field.label === false ? (0, formatLabels_1.toWords)(field.name, true) : field.label);
            const type = new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(new graphql_1.GraphQLUnionType({
                name: fullName,
                types: blockTypes,
                resolveType: (data) => payload.types.blockTypes[data.blockType].name,
            })));
            return {
                ...objectTypeConfig,
                [field.name]: { type: (0, withNullableType_1.default)(field, type) },
            };
        },
        row: (objectTypeConfig, field) => field.fields.reduce((objectTypeConfigWithRowFields, subField) => {
            const addSubField = fieldToSchemaMap[subField.type];
            if (addSubField)
                return addSubField(objectTypeConfigWithRowFields, subField);
            return objectTypeConfigWithRowFields;
        }, objectTypeConfig),
        collapsible: (objectTypeConfig, field) => field.fields.reduce((objectTypeConfigWithCollapsibleFields, subField) => {
            const addSubField = fieldToSchemaMap[subField.type];
            if (addSubField)
                return addSubField(objectTypeConfigWithCollapsibleFields, subField);
            return objectTypeConfigWithCollapsibleFields;
        }, objectTypeConfig),
        tabs: (objectTypeConfig, field) => field.tabs.reduce((tabSchema, tab) => {
            return {
                ...tabSchema,
                ...tab.fields.reduce((subFieldSchema, subField) => {
                    const addSubField = fieldToSchemaMap[subField.type];
                    if (addSubField)
                        return addSubField(subFieldSchema, subField);
                    return subFieldSchema;
                }, tabSchema),
            };
        }, objectTypeConfig),
    };
    const objectSchema = {
        name,
        fields: () => fields.reduce((objectTypeConfig, field) => {
            const fieldSchema = fieldToSchemaMap[field.type];
            if (typeof fieldSchema !== 'function') {
                return objectTypeConfig;
            }
            return {
                ...objectTypeConfig,
                ...fieldSchema(objectTypeConfig, field),
            };
        }, baseFields),
    };
    const newlyCreatedBlockType = new graphql_1.GraphQLObjectType(objectSchema);
    return newlyCreatedBlockType;
}
exports.default = buildObjectType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRPYmplY3RUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL2J1aWxkT2JqZWN0VHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUE0RDtBQUM1RCxxQ0FBcUM7QUFDckMseUNBQXlDO0FBQ3pDLHlDQUF5QztBQUN6Qyx5REFBZ0Q7QUFDaEQscUNBV2lCO0FBQ2pCLHFEQUF5RTtBQXVCekUseUVBQWlEO0FBQ2pELHVGQUErRDtBQUMvRCwwRUFBa0Q7QUFDbEQsK0RBQXVEO0FBQ3ZELG9HQUEwRjtBQUMxRiwrRUFBdUQ7QUFFdkQsZ0ZBQXdEO0FBQ3hELHNFQUE4QztBQUM5Qyx3RUFBZ0Q7QUEyQmhELFNBQVMsZUFBZSxDQUFDLEVBQ3ZCLE9BQU8sRUFDUCxJQUFJLEVBQ0osTUFBTSxFQUNOLFVBQVUsRUFDVixVQUFVLEdBQUcsRUFBRSxFQUNmLGFBQWEsR0FDUjtJQUNMLE1BQU0sZ0JBQWdCLEdBQUc7UUFDdkIsTUFBTSxFQUFFLENBQUMsZ0JBQWtDLEVBQUUsS0FBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNuRSxHQUFHLGdCQUFnQjtZQUNuQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFBLDBCQUFnQixFQUFDLEtBQUssRUFBRSxzQkFBWSxFQUFFLGFBQWEsQ0FBQyxFQUFFO1NBQzdFLENBQUM7UUFDRixJQUFJLEVBQUUsQ0FBQyxnQkFBa0MsRUFBRSxLQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9ELEdBQUcsZ0JBQWdCO1lBQ25CLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUEsMEJBQWdCLEVBQUMsS0FBSyxFQUFFLHVCQUFhLEVBQUUsYUFBYSxDQUFDLEVBQUU7U0FDOUUsQ0FBQztRQUNGLEtBQUssRUFBRSxDQUFDLGdCQUFrQyxFQUFFLEtBQWlCLEVBQUUs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