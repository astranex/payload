export declare const defaults: {
    access: {
        create: ({ req: { user } }: {
            req: import("../../types").PayloadRequest;
        }) => boolean;
        read: ({ req: { user } }: {
            req: import("../../types").PayloadRequest;
        }) => boolean;
        update: ({ req: { user } }: {
            req: import("../../types").PayloadRequest;
        }) => boolean;
        delete: ({ req: { user } }: {
            req: import("../../types").PayloadRequest;
        }) => boolean;
        unlock: ({ req: { user } }: {
            req: import("../../types").PayloadRequest;
        }) => boolean;
    };
    timestamps: boolean;
    admin: {
        useAsTitle: string;
        components: {};
        enableRichTextRelationship: boolean;
        pagination: {
            defaultLimit: number;
            limits: number[];
        };
    };
    fields: any[];
    hooks: {
        beforeOperation: any[];
        beforeValidate: any[];
        beforeChange: any[];
        afterChange: any[];
        beforeRead: any[];
        afterRead: any[];
        beforeDelete: any[];
        afterDelete: any[];
        beforeLogin: any[];
        afterLogin: any[];
        afterLogout: any[];
        afterRefresh: any[];
        afterMe: any[];
        afterForgotPassword: any[];
    };
    endpoints: any[];
    auth: boolean;
    upload: boolean;
    versions: boolean;
};
export declare const authDefaults: {
    tokenExpiration: number;
    maxLoginAttempts: number;
    lockTime: number;
    cookies: {
        secure: boolean;
        sameSite: string;
    };
    verify: boolean;
    forgotPassword: {};
};
