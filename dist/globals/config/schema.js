"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const componentSchema_1 = require("../../utilities/componentSchema");
const schema_1 = require("../../config/schema");
const globalSchema = joi_1.default.object().keys({
    slug: joi_1.default.string().required(),
    label: joi_1.default.string(),
    admin: joi_1.default.object({
        hideAPIURL: joi_1.default.boolean(),
        description: joi_1.default.alternatives().try(joi_1.default.string(), componentSchema_1.componentSchema),
    }),
    hooks: joi_1.default.object({
        beforeValidate: joi_1.default.array().items(joi_1.default.func()),
        beforeChange: joi_1.default.array().items(joi_1.default.func()),
        afterChange: joi_1.default.array().items(joi_1.default.func()),
        beforeRead: joi_1.default.array().items(joi_1.default.func()),
        afterRead: joi_1.default.array().items(joi_1.default.func()),
    }),
    endpoints: schema_1.endpointsSchema,
    access: joi_1.default.object({
        read: joi_1.default.func(),
        readVersions: joi_1.default.func(),
        update: joi_1.default.func(),
    }),
    fields: joi_1.default.array(),
    versions: joi_1.default.alternatives().try(joi_1.default.object({
        max: joi_1.default.number(),
        drafts: joi_1.default.alternatives().try(joi_1.default.object({
            autosave: joi_1.default.alternatives().try(joi_1.default.boolean(), joi_1.default.object({
                interval: joi_1.default.number(),
            })),
        }), joi_1.default.boolean()),
    }), joi_1.default.boolean()),
}).unknown();
exports.default = globalSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dsb2JhbHMvY29uZmlnL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUFzQjtBQUN0QixxRUFBa0U7QUFDbEUsZ0RBQXNEO0FBRXRELE1BQU0sWUFBWSxHQUFHLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDckMsSUFBSSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDN0IsS0FBSyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7SUFDbkIsS0FBSyxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7UUFDaEIsVUFBVSxFQUFFLGFBQUcsQ0FBQyxPQUFPLEVBQUU7UUFDekIsV0FBVyxFQUFFLGFBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQ2pDLGFBQUcsQ0FBQyxNQUFNLEVBQUUsRUFDWixpQ0FBZSxDQUNoQjtLQUNGLENBQUM7SUFDRixLQUFLLEVBQUUsYUFBRyxDQUFDLE1BQU0sQ0FBQztRQUNoQixjQUFjLEVBQUUsYUFBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0MsWUFBWSxFQUFFLGFBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsYUFBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNDLFdBQVcsRUFBRSxhQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxQyxVQUFVLEVBQUUsYUFBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekMsU0FBUyxFQUFFLGFBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsYUFBRyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3pDLENBQUM7SUFDRixTQUFTLEVBQUUsd0JBQWU7SUFDMUIsTUFBTSxFQUFFLGFBQUcsQ0FBQyxNQUFNLENBQUM7UUFDakIsSUFBSSxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUU7UUFDaEIsWUFBWSxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUU7UUFDeEIsTUFBTSxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUU7S0FDbkIsQ0FBQztJQUNGLE1BQU0sRUFBRSxhQUFHLENBQUMsS0FBSyxFQUFFO0lBQ25CLFFBQVEsRUFBRSxhQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUM5QixhQUFHLENBQUMsTUFBTSxDQUFDO1FBQ1QsR0FBRyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7UUFDakIsTUFBTSxFQUFFLGFBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQzVCLGFBQUcsQ0FBQyxNQUFNLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBRyxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FDOUIsYUFBRyxDQUFDLE9BQU8sRUFBRSxFQUNiLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7YUFDdkIsQ0FBQyxDQUNIO1NBQ0YsQ0FBQyxFQUNGLGFBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FDZDtLQUNGLENBQUMsRUFDRixhQUFHLENBQUMsT0FBTyxFQUFFLENBQ2Q7Q0FDRixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFFYixrQkFBZSxZQUFZLENBQUMifQ==