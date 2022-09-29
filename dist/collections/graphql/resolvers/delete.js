"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_1 = __importDefault(require("../../operations/delete"));
function getDeleteResolver(collection) {
    async function resolver(_, args, context) {
        if (args.locale)
            context.req.locale = args.locale;
        if (args.fallbackLocale)
            context.req.fallbackLocale = args.fallbackLocale;
        const options = {
            collection,
            id: args.id,
            req: context.req,
        };
        const result = await (0, delete_1.default)(options);
        return result;
    }
    return resolver;
}
exports.default = getDeleteResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL2dyYXBocWwvcmVzb2x2ZXJzL2RlbGV0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLHFFQUFzRDtBQWN0RCxTQUF3QixpQkFBaUIsQ0FBQyxVQUFzQjtJQUM5RCxLQUFLLFVBQVUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTztRQUN0QyxJQUFJLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxJQUFJLElBQUksQ0FBQyxjQUFjO1lBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUUxRSxNQUFNLE9BQU8sR0FBRztZQUNkLFVBQVU7WUFDVixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7U0FDakIsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSxnQkFBZSxFQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTlDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBakJELG9DQWlCQyJ9