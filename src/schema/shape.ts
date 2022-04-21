import type { Shape } from './any';
import type { JsonSchema, JsonType } from './json';
import type { Nullable } from './nullable';
import type { RequiredMembers } from './required';
import type Reference from './reference';
import type Lazy from './lazy';
import { AnySchema } from './base';

export const OBJECT_TYPE = 'object';

export type ObjectType = typeof OBJECT_TYPE;

export declare interface ObjectJsonSchema<T extends Shape, _partial extends boolean = false> {
  // JSON AnySchema for records and dictionaries
  // 'required' is not optional because it is often forgotten
  // 'properties' are optional for more concise dictionary schemas
  // 'patternProperties' and can be only used with interfaces that have string index
  type: JsonType<ObjectType, _partial>;
  // 'required' type does not guarantee that all required properties are listed
  // it only asserts that optional cannot be listed
  required: _partial extends true ? (keyof T)[] : RequiredMembers<T>[];
  additionalProperties?: boolean | JsonSchema<T[string]>;
  unevaluatedProperties?: boolean | JsonSchema<T[string]>;
  properties?: _partial extends true ? Partial<PropertiesSchema<T>> : PropertiesSchema<T>;
  patternProperties?: { [Pattern in string]?: JsonSchema<T[string]> };
  propertyNames?: JsonSchema<string>;
  dependencies?: { [K in keyof T]?: (keyof T)[] | Partial<JsonSchema<T, true>> };
  dependentRequired?: { [K in keyof T]?: (keyof T)[] };
  dependentSchemas?: { [K in keyof T]?: Partial<JsonSchema<T, true>> };
  minProperties?: number;
  maxProperties?: number;
}

export type ObjectShape = Record<
  string,
  AnySchema | Reference | Lazy<any, any>
>;

export type PropertiesSchema<T> = {
  [K in keyof T]-?: (JsonSchema<T[K]> & Nullable<T[K]>) | { $ref: string; }
};

export default class ObjectSchema<T extends Shape> {
  static create<T extends Shape>(schema: ObjectJsonSchema<T>): ObjectSchema<T> {
    throw '';
  }
}

export default interface ObjectSchema<T extends Shape> {
}