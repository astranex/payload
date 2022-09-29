import { Field } from '../../config/types';
import { PayloadRequest } from '../../../express/types';
declare type Args = {
    currentDepth: number;
    depth: number;
    doc: Record<string, unknown>;
    field: Field;
    fieldPromises: Promise<void>[];
    findMany: boolean;
    flattenLocales: boolean;
    populationPromises: Promise<void>[];
    req: PayloadRequest;
    overrideAccess: boolean;
    siblingDoc: Record<string, unknown>;
    showHiddenFields: boolean;
};
export declare const promise: ({ currentDepth, depth, doc, field, fieldPromises, findMany, flattenLocales, overrideAccess, populationPromises, req, siblingDoc, showHiddenFields, }: Args) => Promise<void>;
export {};
