"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const context_1 = require("../Form/context");
const withCondition = (Field) => {
    const CheckForCondition = (props) => {
        const { admin: { condition, } = {}, } = props;
        if (condition) {
            return react_1.default.createElement(WithCondition, { ...props });
        }
        return react_1.default.createElement(Field, { ...props });
    };
    const WithCondition = (props) => {
        const { name, path: pathFromProps, admin: { condition, } = {}, } = props;
        const path = pathFromProps || name;
        const { getData, getSiblingData, getField, dispatchFields } = (0, context_1.useWatchForm)();
        const data = getData();
        const siblingData = getSiblingData(path);
        const hasCondition = Boolean(condition);
        const currentlyPassesCondition = hasCondition ? condition(data, siblingData) : true;
        const field = getField(path);
        const existingConditionPasses = field === null || field === void 0 ? void 0 : field.passesCondition;
        (0, react_1.useEffect)(() => {
            if (hasCondition) {
                if (!existingConditionPasses && currentlyPassesCondition) {
                    dispatchFields({ type: 'MODIFY_CONDITION', path, result: true });
                }
                if (!currentlyPassesCondition && (existingConditionPasses || typeof existingConditionPasses === 'undefined')) {
                    dispatchFields({ type: 'MODIFY_CONDITION', path, result: false });
                }
            }
        }, [currentlyPassesCondition, existingConditionPasses, dispatchFields, path, hasCondition]);
        if (currentlyPassesCondition) {
            return react_1.default.createElement(Field, { ...props });
        }
        return null;
    };
    return CheckForCondition;
};
exports.default = withCondition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYWRtaW4vY29tcG9uZW50cy9mb3Jtcy93aXRoQ29uZGl0aW9uL2luZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQXlDO0FBRXpDLDZDQUErQztBQUUvQyxNQUFNLGFBQWEsR0FBRyxDQUFvQyxLQUE2QixFQUFlLEVBQUU7SUFDdEcsTUFBTSxpQkFBaUIsR0FBZ0IsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUMvQyxNQUFNLEVBQ0osS0FBSyxFQUFFLEVBQ0wsU0FBUyxHQUNWLEdBQUcsRUFBRSxHQUNQLEdBQUcsS0FBMkIsQ0FBQztRQUVoQyxJQUFJLFNBQVMsRUFBRTtZQUNiLE9BQU8sOEJBQUMsYUFBYSxPQUFLLEtBQUssR0FBSSxDQUFDO1NBQ3JDO1FBRUQsT0FBTyw4QkFBQyxLQUFLLE9BQUssS0FBSyxHQUFJLENBQUM7SUFDOUIsQ0FBQyxDQUFDO0lBRUYsTUFBTSxhQUFhLEdBQWdCLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDM0MsTUFBTSxFQUNKLElBQUksRUFDSixJQUFJLEVBQUUsYUFBYSxFQUNuQixLQUFLLEVBQUUsRUFDTCxTQUFTLEdBQ1YsR0FBRyxFQUFFLEdBQ1AsR0FBRyxLQUVILENBQUM7UUFFRixNQUFNLElBQUksR0FBRyxhQUFhLElBQUksSUFBSSxDQUFDO1FBRW5DLE1BQU0sRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsR0FBRyxJQUFBLHNCQUFZLEdBQUUsQ0FBQztRQUU3RSxNQUFNLElBQUksR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUN2QixNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sd0JBQXdCLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDcEYsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE1BQU0sdUJBQXVCLEdBQUcsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLGVBQWUsQ0FBQztRQUV2RCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1lBQ2IsSUFBSSxZQUFZLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyx1QkFBdUIsSUFBSSx3QkFBd0IsRUFBRTtvQkFDeEQsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztpQkFDbEU7Z0JBRUQsSUFBSSxDQUFDLHdCQUF3QixJQUFJLENBQUMsdUJBQXVCLElBQUksT0FBTyx1QkFBdUIsS0FBSyxXQUFXLENBQUMsRUFBRTtvQkFDNUcsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztpQkFDbkU7YUFDRjtRQUNILENBQUMsRUFBRSxDQUFDLHdCQUF3QixFQUFFLHVCQUF1QixFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUU1RixJQUFJLHdCQUF3QixFQUFFO1lBQzVCLE9BQU8sOEJBQUMsS0FBSyxPQUFLLEtBQUssR0FBSSxDQUFDO1NBQzdCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUM7SUFFRixPQUFPLGlCQUFpQixDQUFDO0FBQzNCLENBQUMsQ0FBQztBQUVGLGtCQUFlLGFBQWEsQ0FBQyJ9