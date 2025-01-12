import { Express, NextFunction, Response } from 'express';
import { DeepRequired } from 'ts-essentials';
import { Transporter } from 'nodemailer';
import { Options } from 'express-fileupload';
import { Configuration } from 'webpack';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import GraphQL from 'graphql';
import { ConnectOptions } from 'mongoose';
import React from 'react';
import { LoggerOptions } from 'pino';
import { Payload } from '..';
import { AfterErrorHook, CollectionConfig, SanitizedCollectionConfig } from '../collections/config/types';
import { GlobalConfig, SanitizedGlobalConfig } from '../globals/config/types';
import { PayloadRequest } from '../express/types';
import { Where } from '../types';
import { User } from '../auth/types';
declare type Email = {
    fromName: string;
    fromAddress: string;
    logMockCredentials?: boolean;
};
export declare type Plugin = (config: Config) => Config;
declare type GeneratePreviewURLOptions = {
    locale: string;
    token: string;
};
export declare type GeneratePreviewURL = (doc: Record<string, unknown>, options: GeneratePreviewURLOptions) => Promise<string> | string;
export declare type EmailTransport = Email & {
    transport: Transporter;
    transportOptions?: SMTPConnection.Options;
};
export declare type EmailTransportOptions = Email & {
    transport?: Transporter;
    transportOptions: SMTPConnection.Options;
};
export declare type EmailOptions = EmailTransport | EmailTransportOptions | Email;
/**
 * type guard for EmailOptions
 * @param emailConfig
 */
export declare function hasTransport(emailConfig: EmailOptions): emailConfig is EmailTransport;
/**
 * type guard for EmailOptions
 * @param emailConfig
 */
export declare function hasTransportOptions(emailConfig: EmailOptions): emailConfig is EmailTransportOptions;
export declare type InitOptions = {
    express?: Express;
    mongoURL: string | false;
    mongoOptions?: ConnectOptions;
    secret: string;
    email?: EmailOptions;
    local?: boolean;
    onInit?: (payload: Payload) => Promise<void> | void;
    /** Pino LoggerOptions */
    loggerOptions?: LoggerOptions;
};
export declare type AccessResult = boolean | Where;
/**
 * Access function
 */
export declare type Access = (args?: any) => AccessResult | Promise<AccessResult>;
export interface PayloadHandler {
    (req: PayloadRequest, res: Response, next: NextFunction): void;
}
export declare type Endpoint = {
    path: string;
    method: 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete' | 'connect' | 'options' | string;
    handler: PayloadHandler | PayloadHandler[];
};
export declare type AdminView = React.ComponentType<{
    user: User;
    canAccessAdmin: boolean;
}>;
export declare type AdminRoute = {
    Component: AdminView;
    path: string;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
};
export declare type LocalizationConfig = {
    locales: string[];
    defaultLocale: string;
    fallback?: boolean;
};
export declare type Config = {
    admin?: {
        user?: string;
        meta?: {
            titleSuffix?: string;
            ogImage?: string;
            favicon?: string;
        };
        disable?: boolean;
        indexHTML?: string;
        css?: string;
        dateFormat?: string;
        components?: {
            routes?: AdminRoute[];
            providers?: React.ComponentType<{
                children: React.ReactNode;
            }>[];
            beforeDashboard?: React.ComponentType<any>[];
            afterDashboard?: React.ComponentType<any>[];
            beforeLogin?: React.ComponentType<any>[];
            afterLogin?: React.ComponentType<any>[];
            beforeNavLinks?: React.ComponentType<any>[];
            afterNavLinks?: React.ComponentType<any>[];
            Nav?: React.ComponentType<any>;
            graphics?: {
                Icon?: React.ComponentType<any>;
                Logo?: React.ComponentType<any>;
            };
            views?: {
                Account?: React.ComponentType<any>;
                Dashboard?: React.ComponentType<any>;
            };
        };
        pagination?: {
            defaultLimit?: number;
            options?: number[];
        };
        webpack?: (config: Configuration) => Configuration;
    };
    collections?: CollectionConfig[];
    endpoints?: Endpoint[];
    globals?: GlobalConfig[];
    serverURL?: string;
    cookiePrefix?: string;
    csrf?: string[];
    cors?: string[] | '*';
    routes?: {
        api?: string;
        admin?: string;
        graphQL?: string;
        graphQLPlayground?: string;
    };
    typescript?: {
        outputFile?: string;
    };
    debug?: boolean;
    express?: {
        json?: {
            limit?: number;
        };
        compression?: {
            [key: string]: unknown;
        };
        /**
         * @deprecated express.middleware will be removed in a future version. Please migrate to express.postMiddleware.
         */
        middleware?: any[];
        preMiddleware?: any[];
        postMiddleware?: any[];
    };
    defaultDepth?: number;
    maxDepth?: number;
    indexSortableFields?: boolean;
    rateLimit?: {
        window?: number;
        max?: number;
        trustProxy?: boolean;
        skip?: (req: PayloadRequest) => boolean;
    };
    upload?: Options;
    localization?: LocalizationConfig | false;
    graphQL?: {
        mutations?: ((graphQL: typeof GraphQL, payload: Payload) => Record<string, unknown>);
        queries?: ((graphQL: typeof GraphQL, payload: Payload) => Record<string, unknown>);
        maxComplexity?: number;
        disablePlaygroundInProduction?: boolean;
        disable?: boolean;
        schemaOutputFile?: string;
    };
    components?: {
        [key: string]: JSX.Element | (() => JSX.Element);
    };
    hooks?: {
        afterError?: AfterErrorHook;
    };
    plugins?: Plugin[];
    telemetry?: boolean;
    onInit?: (payload: Payload) => Promise<void> | void;
};
export declare type SanitizedConfig = Omit<DeepRequired<Config>, 'collections' | 'globals'> & {
    collections: SanitizedCollectionConfig[];
    globals: SanitizedGlobalConfig[];
    paths: {
        [key: string]: string;
    };
};
export declare type EntityDescription = string | (() => string) | React.ComponentType<any>;
export {};
