"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findVersionByID_1 = __importDefault(require("../../operations/findVersionByID"));
function findVersionByIDResolver(collection) {
    return async function resolver(_, args, context) {
        if (args.locale)
            context.req.locale = args.locale;
        if (args.fallbackLocale)
            context.req.fallbackLocale = args.fallbackLocale;
        const options = {
            collection,
            id: args.id,
            req: context.req,
            draft: args.draft,
        };
        const result = await (0, findVersionByID_1.default)(options);
        return result;
    };
}
exports.default = findVersionByIDResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZFZlcnNpb25CeUlELmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL2dyYXBocWwvcmVzb2x2ZXJzL2ZpbmRWZXJzaW9uQnlJRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUlBLHVGQUErRDtBQWdCL0QsU0FBd0IsdUJBQXVCLENBQUMsVUFBc0I7SUFDcEUsT0FBTyxLQUFLLFVBQVUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTztRQUM3QyxJQUFJLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxJQUFJLElBQUksQ0FBQyxjQUFjO1lBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUUxRSxNQUFNLE9BQU8sR0FBRztZQUNkLFVBQVU7WUFDVixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7WUFDaEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ2xCLENBQUM7UUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEseUJBQWUsRUFBQyxPQUFPLENBQUMsQ0FBQztRQUU5QyxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLENBQUM7QUFDSixDQUFDO0FBaEJELDBDQWdCQyJ9