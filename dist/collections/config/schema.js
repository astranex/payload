"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const componentSchema_1 = require("../../utilities/componentSchema");
const schema_1 = require("../../config/schema");
const strategyBaseSchema = joi_1.default.object().keys({
    refresh: joi_1.default.boolean(),
    logout: joi_1.default.boolean(),
});
const collectionSchema = joi_1.default.object().keys({
    slug: joi_1.default.string().required(),
    labels: joi_1.default.object({
        singular: joi_1.default.string(),
        plural: joi_1.default.string(),
    }),
    access: joi_1.default.object({
        create: joi_1.default.func(),
        read: joi_1.default.func(),
        readVersions: joi_1.default.func(),
        update: joi_1.default.func(),
        delete: joi_1.default.func(),
        unlock: joi_1.default.func(),
        admin: joi_1.default.func(),
    }),
    timestamps: joi_1.default.boolean(),
    admin: joi_1.default.object({
        useAsTitle: joi_1.default.string(),
        defaultColumns: joi_1.default.array().items(joi_1.default.string()),
        description: joi_1.default.alternatives().try(joi_1.default.string(), componentSchema_1.componentSchema),
        enableRichTextRelationship: joi_1.default.boolean(),
        components: joi_1.default.object({
            views: joi_1.default.object({
                List: componentSchema_1.componentSchema,
                Edit: componentSchema_1.componentSchema,
            }),
        }),
        pagination: joi_1.default.object({
            defaultLimit: joi_1.default.number(),
            limits: joi_1.default.array().items(joi_1.default.number()),
        }),
        preview: joi_1.default.func(),
        disableDuplicate: joi_1.default.bool(),
        hideAPIURL: joi_1.default.bool(),
    }),
    fields: joi_1.default.array(),
    hooks: joi_1.default.object({
        beforeOperation: joi_1.default.array().items(joi_1.default.func()),
        beforeValidate: joi_1.default.array().items(joi_1.default.func()),
        beforeChange: joi_1.default.array().items(joi_1.default.func()),
        afterChange: joi_1.default.array().items(joi_1.default.func()),
        beforeRead: joi_1.default.array().items(joi_1.default.func()),
        afterRead: joi_1.default.array().items(joi_1.default.func()),
        beforeDelete: joi_1.default.array().items(joi_1.default.func()),
        afterDelete: joi_1.default.array().items(joi_1.default.func()),
        beforeLogin: joi_1.default.array().items(joi_1.default.func()),
        afterLogin: joi_1.default.array().items(joi_1.default.func()),
        afterLogout: joi_1.default.array().items(joi_1.default.func()),
        afterMe: joi_1.default.array().items(joi_1.default.func()),
        afterRefresh: joi_1.default.array().items(joi_1.default.func()),
        afterForgotPassword: joi_1.default.array().items(joi_1.default.func()),
    }),
    endpoints: schema_1.endpointsSchema,
    auth: joi_1.default.alternatives().try(joi_1.default.object({
        tokenExpiration: joi_1.default.number(),
        depth: joi_1.default.number(),
        verify: joi_1.default.alternatives().try(joi_1.default.boolean(), joi_1.default.object().keys({
            generateEmailHTML: joi_1.default.func(),
            generateEmailSubject: joi_1.default.func(),
        })),
        lockTime: joi_1.default.number(),
        useAPIKey: joi_1.default.boolean(),
        cookies: joi_1.default.object().keys({
            secure: joi_1.default.boolean(),
            sameSite: joi_1.default.string(),
            domain: joi_1.default.string(),
        }),
        forgotPassword: joi_1.default.object().keys({
            generateEmailHTML: joi_1.default.func(),
            generateEmailSubject: joi_1.default.func(),
        }),
        maxLoginAttempts: joi_1.default.number(),
        disableLocalStrategy: joi_1.default.boolean().valid(true),
        strategies: joi_1.default.array().items(joi_1.default.alternatives().try(strategyBaseSchema.keys({
            name: joi_1.default.string().required(),
            strategy: joi_1.default.func()
                .maxArity(1)
                .required(),
        }), strategyBaseSchema.keys({
            name: joi_1.default.string(),
            strategy: joi_1.default.object().required(),
        }))),
    }), joi_1.default.boolean()),
    versions: joi_1.default.alternatives().try(joi_1.default.object({
        maxPerDoc: joi_1.default.number(),
        retainDeleted: joi_1.default.boolean(),
        drafts: joi_1.default.alternatives().try(joi_1.default.object({
            autosave: joi_1.default.alternatives().try(joi_1.default.boolean(), joi_1.default.object({
                interval: joi_1.default.number(),
            })),
        }), joi_1.default.boolean()),
    }), joi_1.default.boolean()),
    upload: joi_1.default.alternatives().try(joi_1.default.object({
        staticURL: joi_1.default.string(),
        staticDir: joi_1.default.string(),
        disableLocalStorage: joi_1.default.bool(),
        adminThumbnail: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.func()),
        imageSizes: joi_1.default.array().items(joi_1.default.object().keys({
            name: joi_1.default.string(),
            width: joi_1.default.number().allow(null),
            height: joi_1.default.number().allow(null),
            crop: joi_1.default.string(), // TODO: add further specificity with joi.xor
        })),
        mimeTypes: joi_1.default.array().items(joi_1.default.string()),
        staticOptions: joi_1.default.object(),
        handlers: joi_1.default.array().items(joi_1.default.func()),
    }), joi_1.default.boolean()),
});
exports.default = collectionSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL2NvbmZpZy9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBc0I7QUFDdEIscUVBQWtFO0FBQ2xFLGdEQUFzRDtBQUV0RCxNQUFNLGtCQUFrQixHQUFHLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDM0MsT0FBTyxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUU7SUFDdEIsTUFBTSxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUU7Q0FDdEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxnQkFBZ0IsR0FBRyxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ3pDLElBQUksRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQzdCLE1BQU0sRUFBRSxhQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2pCLFFBQVEsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO1FBQ3RCLE1BQU0sRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO0tBQ3JCLENBQUM7SUFDRixNQUFNLEVBQUUsYUFBRyxDQUFDLE1BQU0sQ0FBQztRQUNqQixNQUFNLEVBQUUsYUFBRyxDQUFDLElBQUksRUFBRTtRQUNsQixJQUFJLEVBQUUsYUFBRyxDQUFDLElBQUksRUFBRTtRQUNoQixZQUFZLEVBQUUsYUFBRyxDQUFDLElBQUksRUFBRTtRQUN4QixNQUFNLEVBQUUsYUFBRyxDQUFDLElBQUksRUFBRTtRQUNsQixNQUFNLEVBQUUsYUFBRyxDQUFDLElBQUksRUFBRTtRQUNsQixNQUFNLEVBQUUsYUFBRyxDQUFDLElBQUksRUFBRTtRQUNsQixLQUFLLEVBQUUsYUFBRyxDQUFDLElBQUksRUFBRTtLQUNsQixDQUFDO0lBQ0YsVUFBVSxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUU7SUFDekIsS0FBSyxFQUFFLGFBQUcsQ0FB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