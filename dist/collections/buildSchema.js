"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const buildQuery_1 = __importDefault(require("../mongoose/buildQuery"));
const buildSchema_1 = __importDefault(require("../mongoose/buildSchema"));
const buildCollectionSchema = (collection, config, schemaOptions = {}) => {
    const schema = (0, buildSchema_1.default)(config, collection.fields, {
        draftsEnabled: Boolean(typeof (collection === null || collection === void 0 ? void 0 : collection.versions) === 'object' && collection.versions.drafts),
        options: { timestamps: collection.timestamps !== false, ...schemaOptions },
    });
    schema.plugin(mongoose_paginate_v2_1.default, { useEstimatedCount: true })
        .plugin(buildQuery_1.default);
    return schema;
};
exports.default = buildCollectionSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRTY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29sbGVjdGlvbnMvYnVpbGRTY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnRkFBNEM7QUFHNUMsd0VBQXNEO0FBQ3RELDBFQUFrRDtBQUdsRCxNQUFNLHFCQUFxQixHQUFHLENBQUMsVUFBcUMsRUFBRSxNQUF1QixFQUFFLGFBQWEsR0FBRyxFQUFFLEVBQVUsRUFBRTtJQUMzSCxNQUFNLE1BQU0sR0FBRyxJQUFBLHFCQUFXLEVBQ3hCLE1BQU0sRUFDTixVQUFVLENBQUMsTUFBTSxFQUNqQjtRQUNFLGFBQWEsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFBLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxRQUFRLENBQUEsS0FBSyxRQUFRLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDOUYsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxVQUFVLEtBQUssS0FBSyxFQUFFLEdBQUcsYUFBYSxFQUFFO0tBQzNFLENBQ0YsQ0FBQztJQUVGLE1BQU0sQ0FBQyxNQUFNLENBQUMsOEJBQVEsRUFBRSxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxDQUFDO1NBQ2pELE1BQU0sQ0FBQyxvQkFBZ0IsQ0FBQyxDQUFDO0lBRTVCLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGLGtCQUFlLHFCQUFxQixDQUFDIn0=