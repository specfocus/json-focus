import type { Any, Array as SimpleArray, Shape, Tuple } from './any';
import type { ArrayJsonSchema } from './array';
import { ARRAY_TYPE } from './array';
import type { BooleanJsonSchema } from './bool';
import { BOOLEAN_TYPE } from './bool';
import { NullableJsonSchema, NULL_TYPE } from './nullable';
import type { NumericJsonSchema } from './numeric';
import { INTEGER_TYPE, NUMBER_TYPE } from './numeric';
import type { ObjectJsonSchema } from './shape';
import { OBJECT_TYPE } from './shape';
import type { StringJsonSchema } from './string';
import { STRING_TYPE } from './string';
import type { TupleJsonSchema } from './tuple';
import { NUMBER_OR_STRING_TYPE, STRING_OR_NUMBER_TYPE } from './value';

export const TYPES = [
  ARRAY_TYPE,
  BOOLEAN_TYPE,
  INTEGER_TYPE,
  NULL_TYPE,
  NUMBER_TYPE,
  NUMBER_OR_STRING_TYPE,
  STRING_TYPE,
  STRING_OR_NUMBER_TYPE,
  OBJECT_TYPE
] as const;

export type Type = typeof TYPES[number];


export declare type JsonType<T extends string, _partial extends boolean> = _partial extends true
  ? T | undefined
  : T;

export declare type SomeJsonSchema = JsonSchema<Any, true>;

export declare type PartialJsonSchema<T> = Partial<JsonSchema<T, true>>;

export declare type JsonSchema<T, _partial extends boolean = false> = (
  T extends number ? NumericJsonSchema<_partial>
  : T extends string ? StringJsonSchema<_partial>
  : T extends boolean ? BooleanJsonSchema
  : T extends Tuple ? TupleJsonSchema<T, _partial>
  : T extends SimpleArray ? ArrayJsonSchema<any, _partial>
  : T extends Shape ? ObjectJsonSchema<T, _partial>
  : T extends null ? NullableJsonSchema
  : never
) & {
  [keyword: string]: any;
  $id?: string;
  $ref?: string;
  $defs?: {
    [Key in string]?: JsonSchema<Any, true>
  };
  definitions?: {
    [Key in string]?: JsonSchema<Any, true>
  };
  allOf?: Partial<JsonSchema<T, true>>[];
  anyOf?: Partial<JsonSchema<T, true>>[];
  oneOf?: Partial<JsonSchema<T, true>>[];
  if?: Partial<JsonSchema<T, true>>;
  then?: Partial<JsonSchema<T, true>>;
  else?: Partial<JsonSchema<T, true>>;
  not?: Partial<JsonSchema<T, true>>;
};
