export declare type Any<nullable extends boolean = false, optional extends boolean = false>
  = Array<nullable, optional> | Shape<nullable, optional> | Tuple<nullable, optional> | Value<nullable, optional> | Date;

export declare type Array<nullable extends boolean = false, optional extends boolean = false>
  = Any<nullable, optional>[];

export type NumberOrString<nullable extends boolean = false, optional extends boolean = false>
  = number | string
  | (nullable extends true ? null : never)
  | (optional extends true ? undefined : never);

export interface Shape<nullable extends boolean = false, optional extends boolean = false>
  extends Record<string, Any<nullable, optional>> { }

export interface Struct<nullable extends boolean = false>
  extends Record<string, Value<nullable> | Value<nullable>[]> { }

export declare type Tuple<nullable extends boolean = false, optional extends boolean = false>
  = [Value<nullable, optional>, ...Value<nullable, optional>[]];

export declare type Value<nullable extends boolean = false, optional extends boolean = false>
  = boolean | NumberOrString<nullable, optional>;

