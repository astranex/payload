"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.afterChange = void 0;
const traverseFields_1 = require("./traverseFields");
const deepCopyObject_1 = __importDefault(require("../../../utilities/deepCopyObject"));
const afterChange = async ({ data, doc: incomingDoc, entityConfig, operation, req, }) => {
    const doc = (0, deepCopyObject_1.default)(incomingDoc);
    await (0, traverseFields_1.traverseFields)({
        data,
        doc,
        fields: entityConfig.fields,
        operation,
        req,
        siblingDoc: doc,
        siblingData: data,
    });
    return doc;
};
exports.afterChange = afterChange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZmllbGRzL2hvb2tzL2FmdGVyQ2hhbmdlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLHFEQUFrRDtBQUNsRCx1RkFBK0Q7QUFVeEQsTUFBTSxXQUFXLEdBQUcsS0FBSyxFQUFFLEVBQ2hDLElBQUksRUFDSixHQUFHLEVBQUUsV0FBVyxFQUNoQixZQUFZLEVBQ1osU0FBUyxFQUNULEdBQUcsR0FDRSxFQUFvQyxFQUFFO0lBQzNDLE1BQU0sR0FBRyxHQUFHLElBQUEsd0JBQWMsRUFBQyxXQUFXLENBQUMsQ0FBQztJQUV4QyxNQUFNLElBQUEsK0JBQWMsRUFBQztRQUNuQixJQUFJO1FBQ0osR0FBRztRQUNILE1BQU0sRUFBRSxZQUFZLENBQUMsTUFBTTtRQUMzQixTQUFTO1FBQ1QsR0FBRztRQUNILFVBQVUsRUFBRSxHQUFHO1FBQ2YsV0FBVyxFQUFFLElBQUk7S0FDbEIsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFwQlcsUUFBQSxXQUFXLGVBb0J0QiJ9