"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpointsSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const component = joi_1.default.alternatives().try(joi_1.default.object().unknown(), joi_1.default.func());
exports.endpointsSchema = joi_1.default.array().items(joi_1.default.object({
    path: joi_1.default.string(),
    method: joi_1.default.string().valid('get', 'head', 'post', 'put', 'patch', 'delete', 'connect', 'options'),
    handler: joi_1.default.alternatives().try(joi_1.default.array().items(joi_1.default.func()), joi_1.default.func()),
}));
exports.default = joi_1.default.object({
    serverURL: joi_1.default.string()
        .uri()
        .allow('')
        .custom((value, helper) => {
        const urlWithoutProtocol = value.split('//')[1];
        if (!urlWithoutProtocol) {
            return helper.message({ custom: 'You need to include either "https://" or "http://" in your serverURL.' });
        }
        if (urlWithoutProtocol.indexOf('/') > -1) {
            return helper.message({ custom: 'Your serverURL cannot have a path. It can only contain a protocol, a domain, and an optional port.' });
        }
        return value;
    }),
    cookiePrefix: joi_1.default.string(),
    routes: joi_1.default.object({
        admin: joi_1.default.string(),
        api: joi_1.default.string(),
        graphQL: joi_1.default.string(),
        graphQLPlayground: joi_1.default.string(),
    }),
    typescript: joi_1.default.object({
        outputFile: joi_1.default.string(),
    }),
    collections: joi_1.default.array(),
    endpoints: exports.endpointsSchema,
    globals: joi_1.default.array(),
    admin: joi_1.default.object({
        user: joi_1.default.string(),
        meta: joi_1.default.object()
            .keys({
            titleSuffix: joi_1.default.string(),
            ogImage: joi_1.default.string(),
            favicon: joi_1.default.string(),
        }),
        disable: joi_1.default.bool(),
        indexHTML: joi_1.default.string(),
        css: joi_1.default.string(),
        dateFormat: joi_1.default.string(),
        components: joi_1.default.object()
            .keys({
            routes: joi_1.default.array()
                .items(joi_1.default.object().keys({
                Component: component.required(),
                path: joi_1.default.string().required(),
                exact: joi_1.default.bool(),
                strict: joi_1.default.bool(),
                sensitive: joi_1.default.bool(),
            })),
            providers: joi_1.default.array().items(component),
            beforeDashboard: joi_1.default.array().items(component),
            afterDashboard: joi_1.default.array().items(component),
            beforeLogin: joi_1.default.array().items(component),
            afterLogin: joi_1.default.array().items(component),
            beforeNavLinks: joi_1.default.array().items(component),
            afterNavLinks: joi_1.default.array().items(component),
            Nav: component,
            views: joi_1.default.object({
                Dashboard: component,
                Account: component,
            }),
            graphics: joi_1.default.object({
                Icon: component,
                Logo: component,
            }),
        }),
        webpack: joi_1.default.func(),
    }),
    defaultDepth: joi_1.default.number()
        .min(0)
        .max(30),
    maxDepth: joi_1.default.number()
        .min(0)
        .max(100),
    csrf: joi_1.default.array()
        .items(joi_1.default.string().allow(''))
        .sparse(),
    cors: [
        joi_1.default.string()
            .valid('*'),
        joi_1.default.array()
            .items(joi_1.default.string()),
    ],
    express: joi_1.default.object()
        .keys({
        json: joi_1.default.object(),
        compression: joi_1.default.object(),
        middleware: joi_1.default.array().items(joi_1.default.func()),
        preMiddleware: joi_1.default.array().items(joi_1.default.func()),
        postMiddleware: joi_1.default.array().items(joi_1.default.func()),
    }),
    local: joi_1.default.boolean(),
    upload: joi_1.default.object(),
    indexSortableFields: joi_1.default.boolean(),
    rateLimit: joi_1.default.object()
        .keys({
        window: joi_1.default.number(),
        max: joi_1.default.number(),
        trustProxy: joi_1.default.boolean(),
        skip: joi_1.default.func(),
    }),
    graphQL: joi_1.default.object()
        .keys({
        mutations: joi_1.default.function(),
        queries: joi_1.default.function(),
        maxComplexity: joi_1.default.number(),
        disablePlaygroundInProduction: joi_1.default.boolean(),
        disable: joi_1.default.boolean(),
        schemaOutputFile: joi_1.default.string(),
    }),
    localization: joi_1.default.alternatives()
        .try(joi_1.default.object().keys({
        locales: joi_1.default.array().items(joi_1.default.string()),
        defaultLocale: joi_1.default.string(),
        fallback: joi_1.default.boolean(),
    }), joi_1.default.boolean()),
    hooks: joi_1.default.object().keys({
        afterError: joi_1.default.func(),
    }),
    telemetry: joi_1.default.boolean(),
    plugins: joi_1.default.array().items(joi_1.default.func()),
    onInit: joi_1.default.func(),
    debug: joi_1.default.boolean(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQXNCO0FBRXRCLE1BQU0sU0FBUyxHQUFHLGFBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQ3RDLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFDdEIsYUFBRyxDQUFDLElBQUksRUFBRSxDQUNYLENBQUM7QUFFVyxRQUFBLGVBQWUsR0FBRyxhQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQUcsQ0FBQyxNQUFNLENBQUM7SUFDMUQsSUFBSSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUU7SUFDbEIsTUFBTSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztJQUNqRyxPQUFPLEVBQUUsYUFBRyxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FDN0IsYUFBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsRUFDN0IsYUFBRyxDQUFDLElBQUksRUFBRSxDQUNYO0NBQ0YsQ0FBQyxDQUFDLENBQUM7QUFFSixrQkFBZSxhQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3hCLFNBQVMsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFO1NBQ3BCLEdBQUcsRUFBRTtTQUNMLEtBQUssQ0FBQyxFQUFFLENBQUM7U0FDVCxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDeEIsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhELElBQUks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