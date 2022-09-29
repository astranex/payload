"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseFields = void 0;
const promise_1 = require("./promise");
const traverseFields = async ({ data, doc, fields, operation, req, siblingData, siblingDoc, }) => {
    const promises = [];
    fields.forEach((field) => {
        promises.push((0, promise_1.promise)({
            data,
            doc,
            field,
            operation,
            req,
            siblingData,
            siblingDoc,
        }));
    });
    await Promise.all(promises);
};
exports.traverseFields = traverseFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhdmVyc2VGaWVsZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZmllbGRzL2hvb2tzL2FmdGVyQ2hhbmdlL3RyYXZlcnNlRmllbGRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFvQztBQWE3QixNQUFNLGNBQWMsR0FBRyxLQUFLLEVBQUUsRUFDbkMsSUFBSSxFQUNKLEdBQUcsRUFDSCxNQUFNLEVBQ04sU0FBUyxFQUNULEdBQUcsRUFDSCxXQUFXLEVBQ1gsVUFBVSxHQUNMLEVBQWlCLEVBQUU7SUFDeEIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBRXBCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUEsaUJBQU8sRUFBQztZQUNwQixJQUFJO1lBQ0osR0FBRztZQUNILEtBQUs7WUFDTCxTQUFTO1lBQ1QsR0FBRztZQUNILFdBQVc7WUFDWCxVQUFVO1NBQ1gsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM5QixDQUFDLENBQUM7QUF4QlcsUUFBQSxjQUFjLGtCQXdCekIifQ==