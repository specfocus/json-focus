import type { JsonType } from './json';

export const BOOLEAN_TYPE = 'boolean';
export type BooleanType = typeof BOOLEAN_TYPE;

export declare interface BooleanJsonSchema<_partial extends boolean = false> {
  type: JsonType<BooleanType, _partial>;
}
