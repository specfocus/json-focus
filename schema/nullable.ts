export const NULL_TYPE = 'null';

export type NullType = typeof NULL_TYPE;

export declare type Nullable<T> = undefined extends T
  ? {
    nullable: true;
    const?: never; // any non-null value would fail `const: null`, `null` would fail any other value in const
    enum?: (T | null)[]; // `null` must be explicitly included in 'enum' for `null` to pass
    default?: T | null;
  }
  : {
    const?: T;
    enum?: T[];
    default?: T;
  };

export declare interface NullableJsonSchema {
  nullable: true;
}