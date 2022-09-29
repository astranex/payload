import { PayloadRequest } from '../../../express/types';
import { Field } from '../../config/types';
declare type Args = {
    data: Record<string, unknown>;
    doc: Record<string, unknown>;
    field: Field;
    id?: string | number;
    operation: 'create' | 'update';
    overrideAccess: boolean;
    req: PayloadRequest;
    siblingData: Record<string, unknown>;
    siblingDoc: Record<string, unknown>;
};
export declare const promise: ({ data, doc, field, id, operation, overrideAccess, req, siblingData, siblingDoc, }: Args) => Promise<void>;
export {};
