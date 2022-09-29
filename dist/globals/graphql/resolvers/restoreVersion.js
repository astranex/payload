"use strict";
/* eslint-disable no-param-reassign */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restoreVersion_1 = __importDefault(require("../../operations/restoreVersion"));
function restoreVersionResolver(globalConfig) {
    return async function resolver(_, args, context) {
        const options = {
            id: args.id,
            globalConfig,
            req: context.req,
        };
        const result = await (0, restoreVersion_1.default)(options);
        return result;
    };
}
exports.default = restoreVersionResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdG9yZVZlcnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ2xvYmFscy9ncmFwaHFsL3Jlc29sdmVycy9yZXN0b3JlVmVyc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDOzs7OztBQUl0QyxxRkFBNkQ7QUFhN0QsU0FBd0Isc0JBQXNCLENBQUMsWUFBbUM7SUFDaEYsT0FBTyxLQUFLLFVBQVUsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTztRQUM3QyxNQUFNLE9BQU8sR0FBRztZQUNkLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNYLFlBQVk7WUFDWixHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7U0FDakIsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSx3QkFBYyxFQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFYRCx5Q0FXQyJ9