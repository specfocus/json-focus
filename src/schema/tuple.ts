import type { Tuple } from './any';
import type { ArrayType } from './array';
import type { JsonSchema, JsonType } from './json';
import type { Nullable } from './nullable';

export declare type TupleJsonSchema<T extends Tuple, _partial extends boolean = false> = {
  type: JsonType<ArrayType, _partial>;
  items: {
    [K in keyof T]-?: JsonSchema<T[K]> & Nullable<T[K]>
  } & { length: T['length']; };
  minItems: T['length'];
} & ({
  maxItems: T['length'];
} | {
  additionalItems: false;
});
