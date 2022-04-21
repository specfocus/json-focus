export declare type Any<nullable extends boolean = true, undefinable extends boolean = true>
= Array<nullable, undefinable> | Shape<nullable, undefinable> | Tuple<nullable, undefinable> | Value<nullable, undefinable>;

export declare type Array<nullable extends boolean = true, undefinable extends boolean = true>
= Any<nullable, undefinable>[];

export interface Shape<nullable extends boolean = true, undefinable extends boolean = true>
extends Record<string, Any<nullable, undefinable>> { }

export declare type Tuple<nullable extends boolean = false, undefinable extends boolean = false>
= [Any<nullable, undefinable>, ...Any<nullable, undefinable>[]];

export declare type Value<nullable extends boolean = true, undefinable extends boolean = true>
= boolean | number | string
| (nullable extends true ? null : never)
| (undefinable extends true ? undefined : never);
