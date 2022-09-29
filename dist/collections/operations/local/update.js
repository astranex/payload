"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFileByPath_1 = __importDefault(require("../../../uploads/getFileByPath"));
const update_1 = __importDefault(require("../update"));
const dataloader_1 = require("../../dataloader");
async function updateLocal(payload, options) {
    var _a;
    const { collection: collectionSlug, depth, locale = payload.config.localization ? (_a = payload.config.localization) === null || _a === void 0 ? void 0 : _a.defaultLocale : null, fallbackLocale = null, data, id, user, overrideAccess = true, showHiddenFields, filePath, file, overwriteExistingFiles = false, draft, autosave, } = options;
    const collection = payload.collections[collectionSlug];
    const req = {
        user,
        payloadAPI: 'local',
        locale,
        fallbackLocale,
        payload,
        files: {
            file: file !== null && file !== void 0 ? file : (0, getFileByPath_1.default)(filePath),
        },
    };
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    const args = {
        depth,
        data,
        collection,
        overrideAccess,
        id,
        showHiddenFields,
        overwriteExistingFiles,
        draft,
        autosave,
        payload,
        req,
    };
    return (0, update_1.default)(args);
}
exports.default = updateLocal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL29wZXJhdGlvbnMvbG9jYWwvdXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsbUZBQTJEO0FBQzNELHVEQUErQjtBQUUvQixpREFBaUQ7QUFtQmxDLEtBQUssVUFBVSxXQUFXLENBQVUsT0FBZ0IsRUFBRSxPQUFtQjs7SUFDdEYsTUFBTSxFQUNKLFVBQVUsRUFBRSxjQUFjLEVBQzFCLEtBQUssRUFDTCxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLDBDQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUN4RixjQUFjLEdBQUcsSUFBSSxFQUNyQixJQUFJLEVBQ0osRUFBRSxFQUNGLElBQUksRUFDSixjQUFjLEdBQUcsSUFBSSxFQUNyQixnQkFBZ0IsRUFDaEIsUUFBUSxFQUNSLElBQUksRUFDSixzQkFBc0IsR0FBRyxLQUFLLEVBQzlCLEtBQUssRUFDTCxRQUFRLEdBQ1QsR0FBRyxPQUFPLENBQUM7SUFFWixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRXZELE1BQU0sR0FBRyxHQUFHO1FBQ1YsSUFBSTtRQUNKLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE1BQU07UUFDTixjQUFjO1FBQ2QsT0FBTztRQUNQLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxJQUFJLGFBQUosSUFBSSxjQUFKLElBQUksR0FBSSxJQUFBLHVCQUFhLEVBQUMsUUFBUSxDQUFDO1NBQ3RDO0tBQ2dCLENBQUM7SUFFcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7UUFBRSxHQUFHLENBQUMsaUJBQWlCLEdBQUcsSUFBQSwwQkFBYSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXZFLE1BQU0sSUFBSSxHQUFHO1FBQ1gsS0FBSztRQUNMLElBQUk7UUFDSixVQUFVO1FBQ1YsY0FBYztRQUNkLEVBQUU7UUFDRixnQkFBZ0I7UUFDaEIsc0JBQXNCO1FBQ3RCLEtBQUs7UUFDTCxRQUFRO1FBQ1IsT0FBTztRQUNQLEdBQUc7S0FDSixDQUFDO0lBRUYsT0FBTyxJQUFBLGdCQUFNLEVBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQWhERCw4QkFnREMifQ==