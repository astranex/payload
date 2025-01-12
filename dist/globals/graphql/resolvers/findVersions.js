"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findVersions_1 = __importDefault(require("../../operations/findVersions"));
function findVersionsResolver(globalConfig) {
    return async function resolver(_, args, context) {
        const options = {
            globalConfig,
            where: args.where,
            limit: args.limit,
            page: args.page,
            sort: args.sort,
            req: context.req,
        };
        const result = await (0, findVersions_1.default)(options);
        return result;
    };
}
exports.default = findVersionsResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZFZlcnNpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dsb2JhbHMvZ3JhcGhxbC9yZXNvbHZlcnMvZmluZFZlcnNpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsaUZBQXlEO0FBa0J6RCxTQUF3QixvQkFBb0IsQ0FBQyxZQUFtQztJQUM5RSxPQUFPLEtBQUssVUFBVSxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPO1FBQzdDLE1BQU0sT0FBTyxHQUFHO1lBQ2QsWUFBWTtZQUNaLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHO1NBQ2pCLENBQUM7UUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsc0JBQVksRUFBQyxPQUFPLENBQUMsQ0FBQztRQUUzQyxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLENBQUM7QUFDSixDQUFDO0FBZkQsdUNBZUMifQ==