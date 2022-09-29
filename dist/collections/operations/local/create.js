"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFileByPath_1 = __importDefault(require("../../../uploads/getFileByPath"));
const create_1 = __importDefault(require("../create"));
const dataloader_1 = require("../../dataloader");
async function createLocal(payload, options) {
    var _a, _b, _c, _d;
    const { collection: collectionSlug, depth, locale, fallbackLocale, data, user, overrideAccess = true, disableVerificationEmail, showHiddenFields, filePath, file, overwriteExistingFiles = false, req = {}, draft, } = options;
    const collection = payload.collections[collectionSlug];
    req.payloadAPI = 'local';
    req.locale = locale || (req === null || req === void 0 ? void 0 : req.locale) || (((_a = payload === null || payload === void 0 ? void 0 : payload.config) === null || _a === void 0 ? void 0 : _a.localization) ? (_c = (_b = payload === null || payload === void 0 ? void 0 : payload.config) === null || _b === void 0 ? void 0 : _b.localization) === null || _c === void 0 ? void 0 : _c.defaultLocale : null);
    req.fallbackLocale = fallbackLocale || (req === null || req === void 0 ? void 0 : req.fallbackLocale) || null;
    req.payload = payload;
    req.files = {
        file: (_d = file) !== null && _d !== void 0 ? _d : (0, getFileByPath_1.default)(filePath),
    };
    if (typeof user !== 'undefined')
        req.user = user;
    if (!req.payloadDataLoader)
        req.payloadDataLoader = (0, dataloader_1.getDataLoader)(req);
    return (0, create_1.default)({
        depth,
        data,
        collection,
        overrideAccess,
        disableVerificationEmail,
        showHiddenFields,
        overwriteExistingFiles,
        draft,
        req,
    });
}
exports.default = createLocal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL29wZXJhdGlvbnMvbG9jYWwvY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsbUZBQTJEO0FBQzNELHVEQUErQjtBQUMvQixpREFBaUQ7QUFvQmxDLEtBQUssVUFBVSxXQUFXLENBQVUsT0FBZ0IsRUFBRSxPQUFtQjs7SUFDdEYsTUFBTSxFQUNKLFVBQVUsRUFBRSxjQUFjLEVBQzFCLEtBQUssRUFDTCxNQUFNLEVBQ04sY0FBYyxFQUNkLElBQUksRUFDSixJQUFJLEVBQ0osY0FBYyxHQUFHLElBQUksRUFDckIsd0JBQXdCLEVBQ3hCLGdCQUFnQixFQUNoQixRQUFRLEVBQ1IsSUFBSSxFQUNKLHNCQUFzQixHQUFHLEtBQUssRUFDOUIsR0FBRyxHQUFHLEVBQW9CLEVBQzFCLEtBQUssR0FDTixHQUFHLE9BQU8sQ0FBQztJQUVaLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFdkQsR0FBRyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7SUFDekIsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEtBQUksR0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLE1BQU0sQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLDBDQUFFLFlBQVksRUFBQyxDQUFDLENBQUMsTUFBQSxNQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLDBDQUFFLFlBQVksMENBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1SCxHQUFHLENBQUMsY0FBYyxHQUFHLGNBQWMsS0FBSSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsY0FBYyxDQUFBLElBQUksSUFBSSxDQUFDO0lBQ25FLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3RCLEdBQUcsQ0FBQyxLQUFLLEdBQUc7UUFDVixJQUFJLEVBQUUsTUFBQyxJQUFxQixtQ0FBSyxJQUFBLHVCQUFhLEVBQUMsUUFBUSxDQUFrQjtLQUMxRSxDQUFDO0lBRUYsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXO1FBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFFakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7UUFBRSxHQUFHLENBQUMsaUJBQWlCLEdBQUcsSUFBQSwwQkFBYSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXZFLE9BQU8sSUFBQSxnQkFBTSxFQUFDO1FBQ1osS0FBSztRQUNMLElBQUk7UUFDSixVQUFVO1FBQ1YsY0FBYztRQUNkLHdCQUF3QjtRQUN4QixnQkFBZ0I7UUFDaEIsc0JBQXNCO1FBQ3RCLEtBQUs7UUFDTCxHQUFHO0tBQ0osQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTNDRCw4QkEyQ0MifQ==