"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
const mongoose_1 = require("mongoose");
const types_1 = require("../fields/config/types");
const formatBaseSchema = (field, buildSchemaOptions) => {
    const schema = {
        unique: (!buildSchemaOptions.disableUnique && field.unique) || false,
        required: false,
        index: field.index || (!buildSchemaOptions.disableUnique && field.unique) || false,
    };
    if ((schema.unique && (field.localized || buildSchemaOptions.draftsEnabled))) {
        schema.sparse = true;
    }
    return schema;
};
const localizeSchema = (field, schema, localization) => {
    if (field.localized && localization && Array.isArray(localization.locales)) {
        return {
            type: localization.locales.reduce((localeSchema, locale) => ({
                ...localeSchema,
                [locale]: schema,
            }), {
                _id: false,
            }),
            localized: true,
        };
    }
    return schema;
};
const buildSchema = (config, configFields, buildSchemaOptions = {}) => {
    const { allowIDField, options } = buildSchemaOptions;
    let fields = {};
    let schemaFields = configFields;
    if (!allowIDField) {
        const idField = schemaFields.find((field) => (0, types_1.fieldAffectsData)(field) && field.name === 'id');
        if (idField) {
            fields = {
                _id: idField.type === 'number' ? Number : String,
            };
            schemaFields = schemaFields.filter((field) => !((0, types_1.fieldAffectsData)(field) && field.name === 'id'));
        }
    }
    const schema = new mongoose_1.Schema(fields, options);
    schemaFields.forEach((field) => {
        if (!(0, types_1.fieldIsPresentationalOnly)(field)) {
            const addFieldSchema = fieldToSchemaMap[field.type];
            if (addFieldSchema) {
                addFieldSchema(field, schema, config, buildSchemaOptions);
            }
        }
    });
    return schema;
};
const fieldToSchemaMap = {
    number: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: Number };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    text: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: String };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    email: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: String };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    textarea: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: String };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    richText: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: mongoose_1.Schema.Types.Mixed };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    code: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: String };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    point: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                required: false,
                default: field.defaultValue || undefined,
            },
        };
        if (buildSchemaOptions.disableUnique && field.unique && field.localized) {
            baseSchema.coordinates.sparse = true;
        }
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
        if (field.index === true || field.index === undefined) {
            const indexOptions = {};
            if (!buildSchemaOptions.disableUnique && field.unique) {
                indexOptions.sparse = true;
                indexOptions.unique = true;
            }
            if (field.localized && config.localization) {
                config.localization.locales.forEach((locale) => {
                    schema.index({ [`${field.name}.${locale}`]: '2dsphere' }, indexOptions);
                });
            }
            else {
                schema.index({ [field.name]: '2dsphere' }, indexOptions);
            }
        }
    },
    radio: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = {
            ...formatBaseSchema(field, buildSchemaOptions),
            type: String,
            enum: field.options.map((option) => {
                if (typeof option === 'object')
                    return option.value;
                return option;
            }),
        };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    checkbox: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: Boolean };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    date: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = { ...formatBaseSchema(field, buildSchemaOptions), type: Date };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    upload: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = {
            ...formatBaseSchema(field, buildSchemaOptions),
            type: mongoose_1.Schema.Types.Mixed,
            ref: field.relationTo,
        };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    relationship: (field, schema, config, buildSchemaOptions) => {
        const hasManyRelations = Array.isArray(field.relationTo);
        let schemaToReturn = {};
        if (field.localized && config.localization) {
            schemaToReturn = {
                type: config.localization.locales.reduce((locales, locale) => {
                    let localeSchema = {};
                    if (hasManyRelations) {
                        localeSchema._id = false;
                        localeSchema.value = {
                            type: mongoose_1.Schema.Types.Mixed,
                            refPath: `${field.name}.${locale}.relationTo`,
                        };
                        localeSchema.relationTo = { type: String, enum: field.relationTo };
                    }
                    else {
                        localeSchema = {
                            ...formatBaseSchema(field, buildSchemaOptions),
                            type: mongoose_1.Schema.Types.Mixed,
                            ref: field.relationTo,
                        };
                    }
                    return {
                        ...locales,
                        [locale]: field.hasMany ? [localeSchema] : localeSchema,
                    };
                }, {}),
                localized: true,
            };
        }
        else if (hasManyRelations) {
            schemaToReturn._id = false;
            schemaToReturn.value = {
                type: mongoose_1.Schema.Types.Mixed,
                refPath: `${field.name}.relationTo`,
            };
            schemaToReturn.relationTo = { type: String, enum: field.relationTo };
            if (field.hasMany)
                schemaToReturn = [schemaToReturn];
        }
        else {
            schemaToReturn = {
                ...formatBaseSchema(field, buildSchemaOptions),
                type: mongoose_1.Schema.Types.Mixed,
                ref: field.relationTo,
            };
            if (field.hasMany)
                schemaToReturn = [schemaToReturn];
        }
        schema.add({
            [field.name]: schemaToReturn,
        });
    },
    row: (field, schema, config, buildSchemaOptions) => {
        field.fields.forEach((subField) => {
            const addFieldSchema = fieldToSchemaMap[subField.type];
            if (addFieldSchema) {
                addFieldSchema(subField, schema, config, buildSchemaOptions);
            }
        });
    },
    collapsible: (field, schema, config, buildSchemaOptions) => {
        field.fields.forEach((subField) => {
            const addFieldSchema = fieldToSchemaMap[subField.type];
            if (addFieldSchema) {
                addFieldSchema(subField, schema, config, buildSchemaOptions);
            }
        });
    },
    tabs: (field, schema, config, buildSchemaOptions) => {
        field.tabs.forEach((tab) => {
            tab.fields.forEach((subField) => {
                const addFieldSchema = fieldToSchemaMap[subField.type];
                if (addFieldSchema) {
                    addFieldSchema(subField, schema, config, buildSchemaOptions);
                }
            });
        });
    },
    array: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = {
            ...formatBaseSchema(field, buildSchemaOptions),
            type: [buildSchema(config, field.fields, {
                    options: { _id: false, id: false },
                    allowIDField: true,
                    disableUnique: buildSchemaOptions.disableUnique,
                })],
        };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    group: (field, schema, config, buildSchemaOptions) => {
        var _a, _b;
        let { required } = field;
        if (((_a = field === null || field === void 0 ? void 0 : field.admin) === null || _a === void 0 ? void 0 : _a.condition) || (field === null || field === void 0 ? void 0 : field.localized) || ((_b = field === null || field === void 0 ? void 0 : field.access) === null || _b === void 0 ? void 0 : _b.create))
            required = false;
        const formattedBaseSchema = formatBaseSchema(field, buildSchemaOptions);
        const baseSchema = {
            ...formattedBaseSchema,
            required: required && field.fields.some((subField) => { var _a, _b; return (!(0, types_1.fieldIsPresentationalOnly)(subField) && subField.required && !subField.localized && !((_a = subField === null || subField === void 0 ? void 0 : subField.admin) === null || _a === void 0 ? void 0 : _a.condition) && !((_b = subField === null || subField === void 0 ? void 0 : subField.access) === null || _b === void 0 ? void 0 : _b.create)); }),
            type: buildSchema(config, field.fields, {
                options: {
                    _id: false,
                    id: false,
                },
                disableUnique: buildSchemaOptions.disableUnique,
            }),
        };
        schema.add({
            [field.name]: localizeSchema(field, baseSchema, config.localization),
        });
    },
    select: (field, schema, config, buildSchemaOptions) => {
        const baseSchema = {
            ...formatBaseSchema(field, buildSchemaOptions),
            type: String,
            enum: field.options.map((option) => {
                if (typeof option === 'object')
                    return option.value;
                return option;
            }),
        };
        const schemaToReturn = localizeSchema(field, baseSchema, config.localization);
        schema.add({
            [field.name]: field.hasMany ? [schemaToReturn] : schemaToReturn,
        });
    },
    blocks: (field, schema, config, buildSchemaOptions) => {
        const fieldSchema = [new mongoose_1.Schema({}, { _id: false, discriminatorKey: 'blockType' })];
        schema.add({
            [field.name]: localizeSchema(field, fieldSchema, config.localization),
        });
        field.blocks.forEach((blockItem) => {
            const blockSchema = new mongoose_1.Schema({}, { _id: false, id: false });
            blockItem.fields.forEach((blockField) => {
                const addFieldSchema = fieldToSchemaMap[blockField.type];
                if (addFieldSchema) {
                    addFieldSchema(blockField, blockSchema, config, buildSchemaOptions);
                }
            });
            if (field.localized && config.localization) {
                config.localization.locales.forEach((locale) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore Possible incorrect typing in mongoose types, this works
                    schema.path(`${field.name}.${locale}`).discriminator(blockItem.slug, blockSchema);
                });
            }
            else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore Possible incorrect typing in mongoose types, this works
                schema.path(field.name).discriminator(blockItem.slug, blockSchema);
            }
        });
    },
};
exports.default = buildSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRTY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9uZ29vc2UvYnVpbGRTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzREFBc0Q7QUFDdEQsMkNBQTJDO0FBQzNDLDREQUE0RDtBQUM1RCx5Q0FBeUM7QUFDekMsdUNBQWtGO0FBRWxGLGtEQUFrWDtBQVlsWCxNQUFNLGdCQUFnQixHQUFHLENBQUMsS0FBNkIsRUFBRSxrQkFBc0MsRUFBRSxFQUFFO0lBQ2pHLE1BQU0sTUFBTSxHQUErQjtRQUN6QyxNQUFNLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSztRQUNwRSxRQUFRLEVBQUUsS0FBSztRQUNmLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUs7S0FDbkYsQ0FBQztJQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFO1FBQzVFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0tBQ3RCO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUE2QixFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRTtJQUM3RSxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksWUFBWSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzFFLE9BQU87WUFDTCxJQUFJLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFD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