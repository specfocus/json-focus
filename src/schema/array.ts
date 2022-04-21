import type { JsonSchema, PartialJsonSchema } from './json';
import type { Array as SimpleArray } from './any';
import type { JsonType } from './json';

export const ARRAY_TYPE = 'array';
export type ArrayType = typeof ARRAY_TYPE;

export declare interface ArrayJsonSchema<T extends SimpleArray, _partial extends boolean = false> {
  type: JsonType<ArrayType, _partial>;
  items: JsonSchema<T[0]>;
  contains?: PartialJsonSchema<T[0]>;
  minItems?: number;
  maxItems?: number;
  minContains?: number;
  maxContains?: number;
  uniqueItems?: true;
  additionalItems?: never;
}
