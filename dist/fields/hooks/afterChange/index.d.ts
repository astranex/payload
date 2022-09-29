import { SanitizedCollectionConfig } from '../../../collections/config/types';
import { SanitizedGlobalConfig } from '../../../globals/config/types';
import { PayloadRequest } from '../../../express/types';
declare type Args = {
    data: Record<string, unknown>;
    doc: Record<string, unknown>;
    entityConfig: SanitizedCollectionConfig | SanitizedGlobalConfig;
    operation: 'create' | 'update';
    req: PayloadRequest;
};
export declare const afterChange: ({ data, doc: incomingDoc, entityConfig, operation, req, }: Args) => Promise<Record<string, unknown>>;
export {};
