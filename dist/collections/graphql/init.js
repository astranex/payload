'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      }
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v
              });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
/* eslint-disable no-param-reassign */
const graphql_scalars_1 = require('graphql-scalars');
const graphql_1 = require('graphql');
const formatName_1 = __importDefault(
    require('../../graphql/utilities/formatName')
);
const buildPaginatedListType_1 = __importDefault(
    require('../../graphql/schema/buildPaginatedListType')
);
const buildMutationInputType_1 = __importStar(
    require('../../graphql/schema/buildMutationInputType')
);
const buildCollectionFields_1 = require('../../versions/buildCollectionFields');
const create_1 = __importDefault(require('./resolvers/create'));
const update_1 = __importDefault(require('./resolvers/update'));
const find_1 = __importDefault(require('./resolvers/find'));
const findByID_1 = __importDefault(require('./resolvers/findByID'));
const findVersionByID_1 = __importDefault(
    require('./resolvers/findVersionByID')
);
const findVersions_1 = __importDefault(require('./resolvers/findVersions'));
const restoreVersion_1 = __importDefault(require('./resolvers/restoreVersion'));
const me_1 = __importDefault(require('../../auth/graphql/resolvers/me'));
const init_1 = __importDefault(require('../../auth/graphql/resolvers/init'));
const login_1 = __importDefault(require('../../auth/graphql/resolvers/login'));
const logout_1 = __importDefault(
    require('../../auth/graphql/resolvers/logout')
);
const forgotPassword_1 = __importDefault(
    require('../../auth/graphql/resolvers/forgotPassword')
);
const resetPassword_1 = __importDefault(
    require('../../auth/graphql/resolvers/resetPassword')
);
const verifyEmail_1 = __importDefault(
    require('../../auth/graphql/resolvers/verifyEmail')
);
const unlock_1 = __importDefault(
    require('../../auth/graphql/resolvers/unlock')
);
const refresh_1 = __importDefault(
    require('../../auth/graphql/resolvers/refresh')
);
const types_1 = require('../../fields/config/types');
const buildObjectType_1 = __importDefault(
    require('../../graphql/schema/buildObjectType')
);
const buildWhereInputType_1 = __importDefault(
    require('../../graphql/schema/buildWhereInputType')
);
const delete_1 = __importDefault(require('./resolvers/delete'));
function initCollectionsGraphQL(payload) {
    Object.keys(payload.collections).forEach((slug) => {
        const collection = payload.collections[slug];
        const {
            config: {
                labels: { singular, plural },
                fields,
                timestamps,
                versions
            }
        } = collection;
        const singularLabel = (0, formatName_1.default)(singular);
        let pluralLabel = (0, formatName_1.default)(plural);
        // For collections named 'Media' or similar,
        // there is a possibility that the singular name
        // will equal the plural name. Append `all` to the beginning
        // of potential conflicts
        if (singularLabel === pluralLabel) {
            pluralLabel = `all${singularLabel}`;
        }
        collection.graphQL = {};
        const idField = fields.find(
            (field) =>
                (0, types_1.fieldAffectsData)(field) && field.name === 'id'
        );
        const idType = (0, buildMutationInputType_1.getCollectionIDType)(
            collection.config
        );
        const baseFields = {};
        const whereInputFields = [...fields];
        if (!idField) {
            baseFields.id = { type: idType };
            whereInputFields.push({
                name: 'id',
                type: 'text'
            });
        }
        if (timestamps) {
            baseFields.createdAt = {
                type: new graphql_1.GraphQLNonNull(
                    graphql_scalars_1.DateTimeResolver
                )
            };
            baseFields.updatedAt = {
                type: new graphql_1.GraphQLNonNull(
                    graphql_scalars_1.DateTimeResolver
                )
            };
            whereInputFields.push({
                name: 'createdAt',
                label: 'Дата создания',
                type: 'date'
            });
            whereInputFields.push({
                name: 'updatedAt',
                label: 'Дата обновления',
                type: 'date'
            });
        }
        const forceNullableObjectType = Boolean(
            versions === null || versions === void 0 ? void 0 : versions.drafts
        );
        collection.graphQL.type = (0, buildObjectType_1.default)({
            payload,
            name: singularLabel,
            parentName: singularLabel,
            fields,
            baseFields,
            forceNullable: forceNullableObjectType
        });
        collection.graphQL.whereInputType = (0, buildWhereInputType_1.default)(
            singularLabel,
            whereInputFields,
            singularLabel
        );
        if (collection.config.auth) {
            fields.push({
                name: 'password',
                label: 'Password',
                type: 'text',
                required: true
            });
        }
        collection.graphQL.mutationInputType = new graphql_1.GraphQLNonNull(
            (0, buildMutationInputType_1.default)(
                payload,
                singularLabel,
                fields,
                singularLabel
            )
        );
        collection.graphQL.updateMutationInputType =
            new graphql_1.GraphQLNonNull(
                (0, buildMutationInputType_1.default)(
                    payload,
                    `${singularLabel}Update`,
                    fields.filter(
                        (field) =>
                            !(
                                (0, types_1.fieldAffectsData)(field) &&
                                field.name === 'id'
                            )
                    ),
                    `${singularLabel}Update`,
                    true
                )
            );
        payload.Query.fields[singularLabel] = {
            type: collection.graphQL.type,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(idType) },
                draft: { type: graphql_1.GraphQLBoolean },
                ...(payload.config.localization
                    ? {
                          locale: { type: payload.types.localeInputType },
                          fallbackLocale: {
                              type: payload.types.fallbackLocaleInputType
                          }
                      }
                    : {})
            },
            resolve: (0, findByID_1.default)(collection)
        };
        payload.Query.fields[pluralLabel] = {
            type: (0, buildPaginatedListType_1.default)(
                pluralLabel,
                collection.graphQL.type
            ),
            args: {
                where: { type: collection.graphQL.whereInputType },
                draft: { type: graphql_1.GraphQLBoolean },
                ...(payload.config.localization
                    ? {
                          locale: { type: payload.types.localeInputType },
                          fallbackLocale: {
                              type: payload.types.fallbackLocaleInputType
                          }
                      }
                    : {}),
                page: { type: graphql_1.GraphQLInt },
                limit: { type: graphql_1.GraphQLInt },
                sort: { type: graphql_1.GraphQLString }
            },
            resolve: (0, find_1.default)(collection)
        };
        payload.Mutation.fields[`create${singularLabel}`] = {
            type: collection.graphQL.type,
            args: {
                data: { type: collection.graphQL.mutationInputType },
                draft: { type: graphql_1.GraphQLBoolean },
                ...(payload.config.localization
                    ? {
                          locale: { type: payload.types.localeInputType }
                      }
                    : {})
            },
            resolve: (0, create_1.default)(collection)
        };
        payload.Mutation.fields[`update${singularLabel}`] = {
            type: collection.graphQL.type,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(idType) },
                data: { type: collection.graphQL.updateMutationInputType },
                draft: { type: graphql_1.GraphQLBoolean },
                autosave: { type: graphql_1.GraphQLBoolean },
                ...(payload.config.localization
                    ? {
                          locale: { type: payload.types.localeInputType }
                      }
                    : {})
            },
            resolve: (0, update_1.default)(collection)
        };
        payload.Mutation.fields[`delete${singularLabel}`] = {
            type: collection.graphQL.type,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(idType) }
            },
            resolve: (0, delete_1.default)(collection)
        };
        if (collection.config.versions) {
            const versionCollectionFields = [
                ...(0, buildCollectionFields_1.buildVersionCollectionFields)(
                    collection.config
                ),
                {
                    name: 'id',
                    type: 'text'
                },
                {
                    name: 'createdAt',
                    label: 'Дата создания',
                    type: 'date'
                },
                {
                    name: 'updatedAt',
                    label: 'Дата обновления',
                    type: 'date'
                }
            ];
            collection.graphQL.versionType = (0, buildObjectType_1.default)({
                payload,
                name: `${singularLabel}Version`,
                fields: versionCollectionFields,
                parentName: `${singularLabel}Version`,
                forceNullable: forceNullableObjectType
            });
            payload.Query.fields[
                `version${(0, formatName_1.default)(singularLabel)}`
            ] = {
                type: collection.graphQL.versionType,
                args: {
                    id: { type: graphql_1.GraphQLString },
                    ...(payload.config.localization
                        ? {
                              locale: { type: payload.types.localeInputType },
                              fallbackLocale: {
                                  type: payload.types.fallbackLocaleInputType
                              }
                          }
                        : {})
                },
                resolve: (0, findVersionByID_1.default)(collection)
            };
            payload.Query.fields[`versions${pluralLabel}`] = {
                type: (0, buildPaginatedListType_1.default)(
                    `versions${(0, formatName_1.default)(pluralLabel)}`,
                    collection.graphQL.versionType
                ),
                args: {
                    where: {
                        type: (0, buildWhereInputType_1.default)(
                            `versions${singularLabel}`,
                            versionCollectionFields,
                            `versions${singularLabel}`
                        )
                    },
                    ...(payload.config.localization
                        ? {
                              locale: { type: payload.types.localeInputType },
                              fallbackLocale: {
                                  type: payload.types.fallbackLocaleInputType
                              }
                          }
                        : {}),
                    page: { type: graphql_1.GraphQLInt },
                    limit: { type: graphql_1.GraphQLInt },
                    sort: { type: graphql_1.GraphQLString }
                },
                resolve: (0, findVersions_1.default)(collection)
            };
            payload.Mutation.fields[
                `restoreVersion${(0, formatName_1.default)(singularLabel)}`
            ] = {
                type: collection.graphQL.type,
                args: {
                    id: { type: graphql_1.GraphQLString }
                },
                resolve: (0, restoreVersion_1.default)(collection)
            };
        }
        if (collection.config.auth) {
            collection.graphQL.JWT = (0, buildObjectType_1.default)({
                payload,
                name: (0, formatName_1.default)(`${slug}JWT`),
                fields: collection.config.fields
                    .filter(
                        (field) =>
                            (0, types_1.fieldAffectsData)(field) &&
                            field.saveToJWT
                    )
                    .concat([
                        {
                            name: 'email',
                            type: 'email',
                            required: true
                        },
                        {
                            name: 'collection',
                            type: 'text',
                            required: true
                        }
                    ]),
                parentName: (0, formatName_1.default)(`${slug}JWT`)
            });
            payload.Query.fields[`me${singularLabel}`] = {
                type: new graphql_1.GraphQLObjectType({
                    name: (0, formatName_1.default)(`${slug}Me`),
                    fields: {
                        token: {
                            type: graphql_1.GraphQLString
                        },
                        user: {
                            type: collection.graphQL.type
                        },
                        exp: {
                            type: graphql_1.GraphQLInt
                        },
                        collection: {
                            type: graphql_1.GraphQLString
                        }
                    }
                }),
                resolve: (0, me_1.default)(collection)
            };
            payload.Query.fields[`initialized${singularLabel}`] = {
                type: graphql_1.GraphQLBoolean,
                resolve: (0, init_1.default)(collection)
            };
            payload.Mutation.fields[`refreshToken${singularLabel}`] = {
                type: new graphql_1.GraphQLObjectType({
                    name: (0, formatName_1.default)(
                        `${slug}Refreshed${singularLabel}`
                    ),
                    fields: {
                        user: {
                            type: collection.graphQL.JWT
                        },
                        refreshedToken: {
                            type: graphql_1.GraphQLString
                        },
                        exp: {
                            type: graphql_1.GraphQLInt
                        }
                    }
                }),
                args: {
                    token: { type: graphql_1.GraphQLString }
                },
                resolve: (0, refresh_1.default)(collection)
            };
            payload.Mutation.fields[`logout${singularLabel}`] = {
                type: graphql_1.GraphQLString,
                resolve: (0, logout_1.default)(collection)
            };
            if (!collection.config.auth.disableLocalStrategy) {
                if (collection.config.auth.maxLoginAttempts > 0) {
                    payload.Mutation.fields[`unlock${singularLabel}`] = {
                        type: new graphql_1.GraphQLNonNull(
                            graphql_1.GraphQLBoolean
                        ),
                        args: {
                            email: {
                                type: new graphql_1.GraphQLNonNull(
                                    graphql_1.GraphQLString
                                )
                            }
                        },
                        resolve: (0, unlock_1.default)(collection)
                    };
                }
                payload.Mutation.fields[`login${singularLabel}`] = {
                    type: new graphql_1.GraphQLObjectType({
                        name: (0, formatName_1.default)(`${slug}LoginResult`),
                        fields: {
                            token: {
                                type: graphql_1.GraphQLString
                            },
                            user: {
                                type: collection.graphQL.type
                            },
                            exp: {
                                type: graphql_1.GraphQLInt
                            }
                        }
                    }),
                    args: {
                        email: { type: graphql_1.GraphQLString },
                        password: { type: graphql_1.GraphQLString }
                    },
                    resolve: (0, login_1.default)(collection)
                };
                payload.Mutation.fields[`forgotPassword${singularLabel}`] = {
                    type: new graphql_1.GraphQLNonNull(
                        graphql_1.GraphQLBoolean
                    ),
                    args: {
                        email: {
                            type: new graphql_1.GraphQLNonNull(
                                graphql_1.GraphQLString
                            )
                        },
                        disableEmail: { type: graphql_1.GraphQLBoolean },
                        expiration: { type: graphql_1.GraphQLInt }
                    },
                    resolve: (0, forgotPassword_1.default)(collection)
                };
                payload.Mutation.fields[`resetPassword${singularLabel}`] = {
                    type: new graphql_1.GraphQLObjectType({
                        name: (0, formatName_1.default)(`${slug}ResetPassword`),
                        fields: {
                            token: { type: graphql_1.GraphQLString },
                            user: { type: collection.graphQL.type }
                        }
                    }),
                    args: {
                        token: { type: graphql_1.GraphQLString },
                        password: { type: graphql_1.GraphQLString }
                    },
                    resolve: (0, resetPassword_1.default)(collection)
                };
                payload.Mutation.fields[`verifyEmail${singularLabel}`] = {
                    type: graphql_1.GraphQLBoolean,
                    args: {
                        token: { type: graphql_1.GraphQLString }
                    },
                    resolve: (0, verifyEmail_1.default)(collection)
                };
            }
        }
    });
}
exports.default = initCollectionsGraphQL;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb2xsZWN0aW9ucy9ncmFwaHFsL2luaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUN0QyxxREFBbUQ7QUFDbkQscUNBTWlCO0FBRWpCLG9GQUE0RDtBQUM1RCx5R0FBaUY7QUFDakYsc0dBQTBHO0FBQzFHLGdGQUFvRjtBQUNwRixnRUFBZ0Q7QUFDaEQsZ0VBQWdEO0FBQ2hELDREQUE0QztBQUM1QyxvRUFBb0Q7QUFDcEQsa0ZBQWtFO0FBQ2xFLDRFQUE0RDtBQUM1RCxnRkFBZ0U7QUFDaEUseUVBQWlEO0FBQ2pELDZFQUFxRDtBQUNyRCwrRUFBdUQ7QUFDdkQsaUZBQXlEO0FBQ3pELGlHQUF5RTtBQUN6RSwrRkFBdUU7QUFDdkUsMkZBQW1FO0FBQ25FLGlGQUF5RDtBQUN6RCxtRkFBMkQ7QUFFM0QscURBQW9FO0FBQ3BFLDJGQUF5RjtBQUN6RixtR0FBMkU7QUFDM0UsZ0VBQW1EO0FBRW5ELFNBQVMsc0JBQXNCLENBQUMsT0FBZ0I7SUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDaEQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxNQUFNLEVBQ0osTUFBTSxFQUFFLEVBQ04sTUFBTSxFQUFFLEVBQ04sUUFBUSxFQUNSLE1BQU0sR0FDUCxFQUNELE1BQU0sRUFDTixVQUFVLEVBQ1YsUUFBUSxHQUNULEdBQ0YsR0FBRyxVQUFVLENBQUM7UUFFZixNQUFNLGFBQWEsR0FBRyxJQUFBLG9CQUFVLEVBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsSUFBSSxXQUFXLEdBQUcsSUFBQSxvQkFBVSxFQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJDLDRDQUE0QztRQUM1QyxnREFBZ0Q7UUFDaEQsNERBQTREO1FBQzVELHlCQUF5QjtRQUV6QixJQUFJLGFBQWEsS0FBSyxXQUFXLEVBQUU7WUFDakMsV0FBVyxHQUFHLE1BQU0sYUFBYSxFQUFFLENBQUM7U0FDckM7UUFFRCxVQUFVLENBQUMsT0FBTyxHQUFHLEVBQVMsQ0FBQztRQUUvQixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFBLHdCQUFnQixFQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDdkYsTUFBTSxNQUFNLEdBQUcsSUFBQSw0Q0FBbUIsRUFBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEQsTUFBTSxVQUFVLEdBQXFCLEVBQUUsQ0FBQztRQUV4QyxNQUFNLGdCQUFnQixHQUFHO1lBQ3ZCLEdBQUcsTUFBTTtTQUNWLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osVUFBVSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUNqQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7Z0JBQ3BCLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxNQUFNO2FBQ2IsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLFVBQVUsRUFBRTtZQUNkLFVBQVUsQ0FBQyxTQUFTLEdBQUc7Z0JBQ3JCLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsa0NBQWdCLENBQUM7YUFDM0MsQ0FBQztZQUVGLFVBQVUsQ0FBQyxTQUFTLEdBQUc7Z0JBQ3JCLElBQUksRUFBRSxJQUFJLHdCQUFjLENBQUMsa0NBQWdCLENBQUM7YUFDM0MsQ0FBQztZQUVGLGdCQUFnQixDQUFDLElBQUksQ0FBQztnQkFDcEIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLEtBQUssRUFBRSxZQUFZO2dCQUNuQixJQUFJLEVBQUUsTUFBTTthQUNiLENBQUMsQ0FBQztZQUVILGdCQUFnQixDQUFDLElBQUksQ0FBQztnQkFDcEIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLEtBQUssRUFBRSxZQUFZO2dCQUNuQixJQUFJLEVBQUUsTUFBTTthQUNiLENBQUMsQ0FBQztTQUNKO1FBRUQsTUFBTSx1QkFBdUIsR0FBRyxPQUFPLENBQUMsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTFELFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUEseUJBQWUsRUFBQztZQUN4QyxPQUFPO1lBQ1AsSUFBSSxFQUFFLGFBQWE7WUFDbkIsVUFBVSxFQUFFLGFBQWE7WUFDekIsTUFBTTtZQUNOLFVBQVU7WUFDVixhQUFhLEVBQUUsdUJBQXVCO1NBQ3ZDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxHQUFHLElBQUEsNkJBQW1CLEVBQ3JELGFBQWEsRUFDYixnQkFBZ0IsRUFDaEIsYUFBYSxDQUNkLENBQUM7UUFFRixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ1YsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLEtBQUssRUFBRSxVQUFVO2dCQUNqQixJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsSUFBSTthQUNmLENBQUMsQ0FBQztTQUNKO1FBRUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHdCQUFjLENBQUMsSUFBQSxnQ0FBc0IsRUFDOUUsT0FBTyxFQUNQLGFBQWEsRUFDYixNQUFNLEVBQ04sYUFBYSxDQUNkLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEdBQUcsSUFBSSx3QkFBYyxDQUFDLElBQUEsZ0NBQXNCLEVBQ3BGLE9BQU8sRUFDUCxHQUFHLGFBQWEsUUFBUSxFQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBQSx3QkFBZ0IsRUFBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQzNFLEdBQUcsYUFBYSxRQUFRLEVBQ3hCLElBQUksQ0FDTCxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRztZQUNwQyxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQzdCLElBQUksRUFBRTtnQkFDSixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4QyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsd0JBQWMsRUFBRTtnQkFDL0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDaEMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO29CQUMvQyxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRTtpQkFDaEUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQ1I7WUFDRCxPQUFPLEVBQUUsSUFBQSxrQkFBZ0IsRUFBQyxVQUFVLENBQUM7U0FDdEMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHO1lBQ2xDLElBQUksRUFBRSxJQUFBLGdDQUFzQixFQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNsRSxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFO2dCQUNsRCxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsd0JBQWMsRUFBRTtnQkFDL0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDaEMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO29CQUMvQyxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRTtpQkFDaEUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO2dCQUMxQixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQVUsRUFBRTtnQkFDM0IsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUFhLEVBQUU7YUFDOUI7WUFDRCxPQUFPLEVBQUUsSUFBQSxjQUFZLEVBQUMsVUFBVSxDQUFDO1NBQ2xDLENBQUM7UUFFRixPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLGFBQWEsRUFBRSxDQUFDLEdBQUc7WUFDbEQsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSTtZQUM3QixJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ3BELEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSx3QkFBYyxFQUFFO2dCQUMvQixHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7aUJBQ2hELENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUNSO1lBQ0QsT0FBTyxFQUFFLElBQUEsZ0JBQWMsRUFBQyxVQUFVLENBQUM7U0FDcEMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsYUFBYSxFQUFFLENBQUMsR0FBRztZQUNsRCxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQzdCLElBQUksRUFBRTtnQkFDSixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUN4QyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRTtnQkFDMUQsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLHdCQUFjLEVBQUU7Z0JBQy9CLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSx3QkFBYyxFQUFFO2dCQUNsQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7aUJBQ2hELENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUNSO1lBQ0QsT0FBTyxFQUFFLElBQUEsZ0JBQWMsRUFBQyxVQUFVLENBQUM7U0FDcEMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsYUFBYSxFQUFFLENBQUMsR0FBRztZQUNsRCxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQzdCLElBQUksRUFBRTtnQkFDSixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2FBQ3pDO1lBQ0QsT0FBTyxFQUFFLElBQUEsZ0JBQWlCLEVBQUMsVUFBVSxDQUFDO1NBQ3ZDLENBQUM7UUFFRixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQzlCLE1BQU0sdUJBQXVCLEdBQVk7Z0JBQ3ZDLEdBQUcsSUFBQSxvREFBNEIsRUFBQyxVQUFVLENBQUMsTUFBTSxDQUFDO2dCQUNsRDtvQkFDRSxJQUFJLEVBQUUsSUFBSTtvQkFDVixJQUFJLEVBQUUsTUFBTTtpQkFDYjtnQkFDRDtvQkFDRSxJQUFJLEVBQUUsV0FBVztvQkFDakIsS0FBSyxFQUFFLFlBQVk7b0JBQ25CLElBQUksRUFBRSxNQUFNO2lCQUNiO2dCQUNEO29CQUNFLElBQUksRUFBRSxXQUFXO29CQUNqQixLQUFLLEVBQUUsWUFBWTtvQkFDbkIsSUFBSSxFQUFFLE1BQU07aUJBQ2I7YUFDRixDQUFDO1lBRUYsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBQSx5QkFBZSxFQUFDO2dCQUMvQyxPQUFPO2dCQUNQLElBQUksRUFBRSxHQUFHLGFBQWEsU0FBUztnQkFDL0IsTUFBTSxFQUFFLHVCQUF1QjtnQkFDL0IsVUFBVSxFQUFFLEdBQUcsYUFBYSxTQUFTO2dCQUNyQyxhQUFhLEVBQUUsdUJBQXVCO2FBQ3ZDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBQSxvQkFBVSxFQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRztnQkFDNUQsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDcEMsSUFBSSxFQUFFO29CQUNKLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBYSxFQUFFO29CQUMzQixHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNoQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7d0JBQy9DLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFO3FCQUNoRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQ1I7Z0JBQ0QsT0FBTyxFQUFFLElBQUEseUJBQXVCLEVBQUMsVUFBVSxDQUFDO2FBQzdDLENBQUM7WUFDRixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLFdBQVcsRUFBRSxDQUFDLEdBQUc7Z0JBQy9DLElBQUksRUFBRSxJQUFBLGdDQUFzQixFQUFDLFdBQVcsSUFBQSxvQkFBVSxFQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7Z0JBQ2xHLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLElBQUEsNkJBQW1CLEVBQ3ZCLFdBQVcsYUFBYSxFQUFFLEVBQzFCLHVCQUF1QixFQUN2QixXQUFXLGFBQWEsRUFBRSxDQUMzQjtxQkFDRjtvQkFDRCxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNoQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7d0JBQy9DLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFO3FCQUNoRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ1AsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFVLEVBQUU7b0JBQzFCLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO29CQUMzQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQWEsRUFBRTtpQkFDOUI7Z0JBQ0QsT0FBTyxFQUFFLElBQUEsc0JBQW9CLEVBQUMsVUFBVSxDQUFDO2FBQzFDLENBQUM7WUFDRixPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsSUFBQSxvQkFBVSxFQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRztnQkFDdEUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSTtnQkFDN0IsSUFBSSxFQUFFO29CQUNKLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBYSxFQUFFO2lCQUM1QjtnQkFDRCxPQUFPLEVBQUUsSUFBQSx3QkFBc0IsRUFBQyxVQUFVLENBQUM7YUFDNUMsQ0FBQztTQUNIO1FBRUQsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtZQUMxQixVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFBLHlCQUFlLEVBQUM7Z0JBQ3ZDLE9BQU87Z0JBQ1AsSUFBSSxFQUFFLElBQUEsb0JBQVUsRUFBQyxHQUFHLElBQUksS0FBSyxDQUFDO2dCQUM5QixNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFBLHdCQUFnQixFQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQ3BHO3dCQUNFLElBQUksRUFBRSxPQUFPO3dCQUNiLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRSxJQUFJO3FCQUNmO29CQUNEO3dCQUNFLElBQUksRUFBRSxZQUFZO3dCQUNsQixJQUFJLEVBQUUsTUFBTTt3QkFDWixRQUFRLEVBQUUsSUFBSTtxQkFDZjtpQkFDRixDQUFDO2dCQUNGLFVBQVUsRUFBRSxJQUFBLG9CQUFVLEVBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQzthQUNyQyxDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLGFBQWEsRUFBRSxDQUFDLEdBQUc7Z0JBQzNDLElBQUksRUFBRSxJQUFJLDJCQUFpQixDQUFDO29CQUMxQixJQUFJLEVBQUUsSUFBQSxvQkFBVSxFQUFDLEdBQUcsSUFBSSxJQUFJLENBQUM7b0JBQzdCLE1BQU0sRUFBRTt3QkFDTixLQUFLLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLHVCQUFhO3lCQUNwQjt3QkFDRCxJQUFJLEVBQUU7NEJBQ0osSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSTt5QkFDOUI7d0JBQ0QsR0FBRyxFQUFFOzRCQUNILElBQUksRUFBRSxvQkFBVTt5QkFDakI7d0JBQ0QsVUFBVSxFQUFFOzRCQUNWLElBQUksRUFBRSx1QkFBYTt5QkFDcEI7cUJBQ0Y7aUJBQ0YsQ0FBQztnQkFDRixPQUFPLEVBQUUsSUFBQSxZQUFFLEVBQUMsVUFBVSxDQUFDO2FBQ3hCLENBQUM7WUFFRixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLGFBQWEsRUFBRSxDQUFDLEdBQUc7Z0JBQ3BELElBQUksRUFBRSx3QkFBYztnQkFDcEIsT0FBTyxFQUFFLElBQUEsY0FBSSxFQUFDLFVBQVUsQ0FBQzthQUMxQixDQUFDO1lBRUYsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxhQUFhLEVBQUUsQ0FBQyxHQUFHO2dCQUN4RCxJQUFJLEVBQUUsSUFBSSwyQkFBaUIsQ0FBQztvQkFDMUIsSUFBSSxFQUFFLElBQUEsb0JBQVUsRUFBQyxHQUFHLElBQUksWUFBWSxhQUFhLEVBQUUsQ0FBQztvQkFDcEQsTUFBTSxFQUFFO3dCQUNOLElBQUksRUFBRTs0QkFDSixJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHO3lCQUM3Qjt3QkFDRCxjQUFjLEVBQUU7NEJBQ2QsSUFBSSxFQUFFLHVCQUFhO3lCQUNwQjt3QkFDRCxHQUFHLEVBQUU7NEJBQ0gsSUFBSSxFQUFFLG9CQUFVO3lCQUNqQjtxQkFDRjtpQkFDRixDQUFDO2dCQUNGLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQWEsRUFBRTtpQkFDL0I7Z0JBQ0QsT0FBTyxFQUFFLElBQUEsaUJBQU8sRUFBQyxVQUFVLENBQUM7YUFDN0IsQ0FBQztZQUVGLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsYUFBYSxFQUFFLENBQUMsR0FBRztnQkFDbEQsSUFBSSxFQUFFLHVCQUFhO2dCQUNuQixPQUFPLEVBQUUsSUFBQSxnQkFBTSxFQUFDLFVBQVUsQ0FBQzthQUM1QixDQUFDO1lBRUYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUNoRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsRUFBRTtvQkFDL0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxhQUFhLEVBQUUsQ0FBQyxHQUFHO3dCQUNsRCxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLHdCQUFjLENBQUM7d0JBQ3hDLElBQUksRUFBRTs0QkFDSixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSx3QkFBYyxDQUFDLHVCQUFhLENBQUMsRUFBRTt5QkFDbkQ7d0JBQ0QsT0FBTyxFQUFFLElBQUEsZ0JBQU0sRUFBQyxVQUFVLENBQUM7cUJBQzVCLENBQUM7aUJBQ0g7Z0JBRUQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxhQUFhLEVBQUUsQ0FBQyxHQUFHO29CQUNqRCxJQUFJLEVBQUUsSUFBSSwyQkFBaUIsQ0FBQzt3QkFDMUIsSUFBSSxFQUFFLElBQUEsb0JBQVUsRUFBQyxHQUFHLElBQUksYUFBYSxDQUFDO3dCQUN0QyxNQUFNLEVBQUU7NEJBQ04sS0FBSyxFQUFFO2dDQUNMLElBQUksRUFBRSx1QkFBYTs2QkFDcEI7NEJBQ0QsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUk7NkJBQzlCOzRCQUNELEdBQUcsRUFBRTtnQ0FDSCxJQUFJLEVBQUUsb0JBQVU7NkJBQ2pCO3lCQUNGO3FCQUNGLENBQUM7b0JBQ0YsSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBYSxFQUFFO3dCQUM5QixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQWEsRUFBRTtxQkFDbEM7b0JBQ0QsT0FBTyxFQUFFLElBQUEsZUFBSyxFQUFDLFVBQVUsQ0FBQztpQkFDM0IsQ0FBQztnQkFFRixPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsYUFBYSxFQUFFLENBQUMsR0FBRztvQkFDMUQsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyx3QkFBYyxDQUFDO29CQUN4QyxJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyx1QkFBYSxDQUFDLEVBQUU7d0JBQ2xELFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSx3QkFBYyxFQUFFO3dCQUN0QyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQVUsRUFBRTtxQkFDakM7b0JBQ0QsT0FBTyxFQUFFLElBQUEsd0JBQWMsRUFBQyxVQUFVLENBQUM7aUJBQ3BDLENBQUM7Z0JBRUYsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLGFBQWEsRUFBRSxDQUFDLEdBQUc7b0JBQ3pELElBQUksRUFBRSxJQUFJLDJCQUFpQixDQUFDO3dCQUMxQixJQUFJLEVBQUUsSUFBQSxvQkFBVSxFQUFDLEdBQUcsSUFBSSxlQUFlLENBQUM7d0JBQ3hDLE1BQU0sRUFBRTs0QkFDTixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQWEsRUFBRTs0QkFDOUIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO3lCQUN4QztxQkFDRixDQUFDO29CQUNGLElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQWEsRUFBRTt3QkFDOUIsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUFhLEVBQUU7cUJBQ2xDO29CQUNELE9BQU8sRUFBRSxJQUFBLHVCQUFhLEVBQUMsVUFBVSxDQUFDO2lCQUNuQyxDQUFDO2dCQUVGLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsYUFBYSxFQUFFLENBQUMsR0FBRztvQkFDdkQsSUFBSSxFQUFFLHdCQUFjO29CQUNwQixJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLHVCQUFhLEVBQUU7cUJBQy9CO29CQUNELE9BQU8sRUFBRSxJQUFBLHFCQUFXLEVBQUMsVUFBVSxDQUFDO2lCQUNqQyxDQUFDO2FBQ0g7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELGtCQUFlLHNCQUFzQixDQUFDIn0=
