"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypes = void 0;
/* eslint-disable no-nested-ternary */
const fs_1 = __importDefault(require("fs"));
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
const logger_1 = __importDefault(require("../utilities/logger"));
const types_1 = require("../fields/config/types");
const load_1 = __importDefault(require("../config/load"));
const deepCopyObject_1 = __importDefault(require("../utilities/deepCopyObject"));
const nonOptionalFieldTypes = ['group', 'array', 'blocks'];
const propertyIsOptional = (field) => {
    return (0, types_1.fieldAffectsData)(field) && (field.required === true || nonOptionalFieldTypes.includes(field.type));
};
function getCollectionIDType(collections, slug) {
    const matchedCollection = collections.find((collection) => collection.slug === slug);
    const customIdField = matchedCollection.fields.find((field) => 'name' in field && field.name === 'id');
    if (customIdField && customIdField.type === 'number') {
        return 'number';
    }
    return 'string';
}
function returnOptionEnums(options) {
    return options.map((option) => {
        if (typeof option === 'object' && 'value' in option) {
            return option.value;
        }
        return option;
    });
}
function generateFieldTypes(config, fields) {
    let topLevelProps = [];
    let requiredTopLevelProps = [];
    return {
        properties: Object.fromEntries(fields.reduce((properties, field) => {
            let fieldSchema;
            switch (field.type) {
                case 'text':
                case 'textarea':
                case 'code':
                case 'email':
                case 'date': {
                    fieldSchema = { type: 'string' };
                    break;
                }
                case 'number': {
                    fieldSchema = { type: 'number' };
                    break;
                }
                case 'checkbox': {
                    fieldSchema = { type: 'boolean' };
                    break;
                }
                case 'richText': {
                    fieldSchema = {
                        type: 'array',
                        items: {
                            type: 'object',
                        },
                    };
                    break;
                }
                case 'radio': {
                    fieldSchema = {
                        type: 'string',
                        enum: returnOptionEnums(field.options),
                    };
                    break;
                }
                case 'select': {
                    const selectType = {
                        type: 'string',
                        enum: returnOptionEnums(field.options),
                    };
                    if (field.hasMany) {
                        fieldSchema = {
                            type: 'array',
                            items: selectType,
                        };
                    }
                    else {
                        fieldSchema = selectType;
                    }
                    break;
                }
                case 'point': {
                    fieldSchema = {
                        type: 'array',
                        minItems: 2,
                        maxItems: 2,
                        items: [
                            {
                                type: 'number',
                            },
                            {
                                type: 'number',
                            },
                        ],
                    };
                    break;
                }
                case 'relationship': {
                    if (Array.isArray(field.relationTo)) {
                        if (field.hasMany) {
                            fieldSchema = {
                                type: 'array',
                                items: {
                                    oneOf: field.relationTo.map((relation) => {
                                        const idFieldType = getCollectionIDType(config.collections, relation);
                                        return {
                                            type: 'object',
                                            additionalProperties: false,
                                            properties: {
                                                value: {
                                                    oneOf: [
                                                        {
                                                            type: idFieldType,
                                                        },
                                                        {
                                                            $ref: `#/definitions/${relation}`,
                                                        },
                                                    ],
                                                },
                                                relationTo: {
                                                    const: relation,
                                                },
                                            },
                                            required: ['value', 'relationTo'],
                                        };
                                    }),
                                },
                            };
                        }
                        else {
                            fieldSchema = {
                                oneOf: field.relationTo.map((relation) => {
                                    const idFieldType = getCollectionIDType(config.collections, relation);
                                    return {
                                        type: 'object',
                                        additionalProperties: false,
                                        properties: {
                                            value: {
                                                oneOf: [
                                                    {
                                                        type: idFieldType,
                                                    },
                                                    {
                                                        $ref: `#/definitions/${relation}`,
                                                    },
                                                ],
                                            },
                                            relationTo: {
                                                const: relation,
                                            },
                                        },
                                        required: ['value', 'relationTo'],
                                    };
                                }),
                            };
                        }
                    }
                    else {
                        const idFieldType = getCollectionIDType(config.collections, field.relationTo);
                        if (field.hasMany) {
                            fieldSchema = {
                                type: 'array',
                                items: {
                                    oneOf: [
                                        {
                                            type: idFieldType,
                                        },
                                        {
                                            $ref: `#/definitions/${field.relationTo}`,
                                        },
                                    ],
                                },
                            };
                        }
                        else {
                            fieldSchema = {
                                oneOf: [
                                    {
                                        type: idFieldType,
                                    },
                                    {
                                        $ref: `#/definitions/${field.relationTo}`,
                                    },
                                ],
                            };
                        }
                    }
                    break;
                }
                case 'upload': {
                    const idFieldType = getCollectionIDType(config.collections, field.relationTo);
                    fieldSchema = {
                        oneOf: [
                            {
                                type: idFieldType,
                            },
                            {
                                $ref: `#/definitions/${field.relationTo}`,
                            },
                        ],
                    };
                    break;
                }
                case 'blocks': {
                    fieldSchema = {
                        type: 'array',
                        items: {
                            oneOf: field.blocks.map((block) => {
                                const blockSchema = generateFieldTypes(config, block.fields);
                                return {
                                    type: 'object',
                                    additionalProperties: false,
                                    properties: {
                                        ...blockSchema.properties,
                                        blockType: {
                                            const: block.slug,
                                        },
                                    },
                                    required: [
                                        'blockType',
                                        ...blockSchema.required,
                                    ],
                                };
                            }),
                        },
                    };
                    break;
                }
                case 'array': {
                    fieldSchema = {
                        type: 'array',
                        items: {
                            type: 'object',
                            additionalProperties: false,
                            ...generateFieldTypes(config, field.fields),
                        },
                    };
                    break;
                }
                case 'row':
                case 'collapsible': {
                    const topLevelFields = generateFieldTypes(config, field.fields);
                    requiredTopLevelProps = requiredTopLevelProps.concat(topLevelFields.required);
                    topLevelProps = topLevelProps.concat(Object.entries(topLevelFields.properties).map((prop) => prop));
                    break;
                }
                case 'tabs': {
                    field.tabs.forEach((tab) => {
                        const topLevelFields = generateFieldTypes(config, tab.fields);
                        requiredTopLevelProps = requiredTopLevelProps.concat(topLevelFields.required);
                        topLevelProps = topLevelProps.concat(Object.entries(topLevelFields.properties).map((prop) => prop));
                    });
                    break;
                }
                case 'group': {
                    fieldSchema = {
                        type: 'object',
                        additionalProperties: false,
                        ...generateFieldTypes(config, field.fields),
                    };
                    break;
                }
                default: {
                    break;
                }
            }
            if (fieldSchema && (0, types_1.fieldAffectsData)(field)) {
                return [
                    ...properties,
                    [
                        field.name,
                        {
                            ...fieldSchema,
                        },
                    ],
                ];
            }
            return [
                ...properties,
                ...topLevelProps,
            ];
        }, [])),
        required: [
            ...fields
                .filter(propertyIsOptional)
                .map((field) => ((0, types_1.fieldAffectsData)(field) ? field.name : '')),
            ...requiredTopLevelProps,
        ],
    };
}
function entityToJsonSchema(config, incomingEntity) {
    const entity = (0, deepCopyObject_1.default)(incomingEntity);
    const title = 'label' in entity ? entity.label : entity.labels.singular;
    const idField = { type: 'text', name: 'id', required: true };
    const customIdField = entity.fields.find((field) => (0, types_1.fieldAffectsData)(field) && field.name === 'id');
    if (customIdField) {
        customIdField.required = true;
    }
    else {
        entity.fields.unshift(idField);
    }
    if ('timestamps' in entity && entity.timestamps !== false) {
        entity.fields.push({
            type: 'text',
            name: 'createdAt',
            required: true,
        }, {
            type: 'text',
            name: 'updatedAt',
            required: true,
        });
    }
    return {
        title,
        type: 'object',
        additionalProperties: false,
        ...generateFieldTypes(config, entity.fields),
    };
}
function configToJsonSchema(config) {
    return {
        definitions: Object.fromEntries([
            ...config.globals.map((global) => [
                global.slug,
                entityToJsonSchema(config, global),
            ]),
            ...config.collections.map((collection) => [
                collection.slug,
                entityToJsonSchema(config, collection),
            ]),
        ]),
        additionalProperties: false,
    };
}
function generateTypes() {
    const logger = (0, logger_1.default)();
    const config = (0, load_1.default)();
    const outputFile = process.env.PAYLOAD_TS_OUTPUT_PATH || config.typescript.outputFile;
    logger.info('Compiling TS types for Collections and Globals...');
    const jsonSchema = configToJsonSchema(config);
    (0, json_schema_to_typescript_1.compile)(jsonSchema, 'Config', {
        unreachableDefinitions: true,
        bannerComment: '/* tslint:disable */\n/**\n* This file was automatically generated by Payload CMS.\n* DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,\n* and re-run `payload generate:types` to regenerate this file.\n*/',
        style: {
            singleQuote: true,
        },
    }).then((compiled) => {
        fs_1.default.writeFileSync(outputFile, compiled);
        logger.info(`Types written to ${outputFile}`);
    });
}
exports.generateTypes = generateTypes;
// when generateTypes.js is launched directly
if (module.id === require.main.id) {
    generateTypes();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVUeXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vZ2VuZXJhdGVUeXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsNENBQW9CO0FBRXBCLHlFQUFvRDtBQUNwRCxpRUFBeUM7QUFDekMsa0RBQTZGO0FBRzdGLDBEQUF3QztBQUV4QyxpRkFBeUQ7QUFFekQsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFM0QsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLEtBQVksRUFBRSxFQUFFO0lBQzFDLE9BQU8sSUFBQSx3QkFBZ0IsRUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1RyxDQUFDLENBQUM7QUFFRixTQUFTLG1CQUFtQixDQUFDLFdBQXdDLEVBQUUsSUFBWTtJQUNqRixNQUFNLGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDckYsTUFBTSxhQUFhLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0lBRXZHLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQ3BELE9BQU8sUUFBUSxDQUFDO0tBQ2pCO0lBRUQsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsT0FBaUI7SUFDMUMsT0FBTyxPQUFPLENB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