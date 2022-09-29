"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
const path_1 = __importDefault(require("path"));
exports.defaults = {
    serverURL: '',
    defaultDepth: 2,
    maxDepth: 10,
    collections: [],
    globals: [],
    endpoints: [],
    cookiePrefix: 'payload',
    csrf: [],
    cors: [],
    admin: {
        meta: {
            titleSuffix: '- Payload',
        },
        disable: false,
        indexHTML: path_1.default.resolve(__dirname, '../admin/index.html'),
        components: {},
        css: path_1.default.resolve(__dirname, '../admin/scss/custom.css'),
        dateFormat: 'MMMM do yyyy, h:mm a',
    },
    typescript: {
        outputFile: `${typeof (process === null || process === void 0 ? void 0 : process.cwd) === 'function' ? process.cwd() : ''}/payload-types.ts`,
    },
    upload: {},
    graphQL: {
        maxComplexity: 1000,
        disablePlaygroundInProduction: true,
        schemaOutputFile: `${typeof (process === null || process === void 0 ? void 0 : process.cwd) === 'function' ? process.cwd() : ''}/schema.graphql`,
    },
    routes: {
        admin: '/admin',
        api: '/api',
        graphQL: '/graphql',
        graphQLPlayground: '/graphql-playground',
    },
    rateLimit: {
        window: 15 * 60 * 100,
        max: 500,
    },
    express: {
        json: {},
        compression: {},
        middleware: [],
        preMiddleware: [],
        postMiddleware: [],
    },
    hooks: {},
    localization: false,
    telemetry: true,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2RlZmF1bHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdEQUF3QjtBQUdYLFFBQUEsUUFBUSxHQUFXO0lBQzlCLFNBQVMsRUFBRSxFQUFFO0lBQ2IsWUFBWSxFQUFFLENBQUM7SUFDZixRQUFRLEVBQUUsRUFBRTtJQUNaLFdBQVcsRUFBRSxFQUFFO0lBQ2YsT0FBTyxFQUFFLEVBQUU7SUFDWCxTQUFTLEVBQUUsRUFBRTtJQUNiLFlBQVksRUFBRSxTQUFTO0lBQ3ZCLElBQUksRUFBRSxFQUFFO0lBQ1IsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUUsV0FBVztTQUN6QjtRQUNELE9BQU8sRUFBRSxLQUFLO1FBQ2QsU0FBUyxFQUFFLGNBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDO1FBQ3pELFVBQVUsRUFBRSxFQUFFO1FBQ2QsR0FBRyxFQUFFLGNBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLDBCQUEwQixDQUFDO1FBQ3hELFVBQVUsRUFBRSxzQkFBc0I7S0FDbkM7SUFDRCxVQUFVLEVBQUU7UUFDVixVQUFVLEVBQUUsR0FBRyxPQUFPLENBQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEdBQUcsQ0FBQSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLG1CQUFtQjtLQUMxRjtJQUNELE1BQU0sRUFBRSxFQUFFO0lBQ1YsT0FBTyxFQUFFO1FBQ1AsYUFBYSxFQUFFLElBQUk7UUFDbkIsNkJBQTZCLEVBQUUsSUFBSTtRQUNuQyxnQkFBZ0IsRUFBRSxHQUFHLE9BQU8sQ0FBQSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxDQUFBLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCO0tBQzlGO0lBQ0QsTUFBTSxFQUFFO1FBQ04sS0FBSyxFQUFFLFFBQVE7UUFDZixHQUFHLEVBQUUsTUFBTTtRQUNYLE9BQU8sRUFBRSxVQUFVO1FBQ25CLGlCQUFpQixFQUFFLHFCQUFxQjtLQUN6QztJQUNELFNBQVMsRUFBRTtRQUNULE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUc7UUFDckIsR0FBRyxFQUFFLEdBQUc7S0FDVDtJQUNELE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxFQUFFO1FBQ1IsV0FBVyxFQUFFLEVBQUU7UUFDZixVQUFVLEVBQUUsRUFBRTtRQUNkLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLGNBQWMsRUFBRSxFQUFFO0tBQ25CO0lBQ0QsS0FBSyxFQUFFLEVBQUU7SUFDVCxZQUFZLEVBQUUsS0FBSztJQUNuQixTQUFTLEVBQUUsSUFBSTtDQUNoQixDQUFDIn0=