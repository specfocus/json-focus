export const ARRAY_TYPE = 'array';
export const BOOLEAN_TYPE = 'boolean';
export const INTEGER_TYPE = 'integer';
export const NULL_TYPE = 'null';
export const NUMBER_TYPE = 'number';
export const STRING_TYPE = 'string';
export const OBJECT_TYPE = 'object';
export const NUMBER_OR_STRING_TYPE = [NUMBER_TYPE, STRING_TYPE];
export const STRING_OR_NUMBER_TYPE = [STRING_TYPE, NUMBER_TYPE];

export type ArrayType = typeof ARRAY_TYPE;
export type BooleanType = typeof BOOLEAN_TYPE;
export type IntegerType = typeof INTEGER_TYPE;
export type NullType = typeof NULL_TYPE;
export type NumberOrStringType = typeof NUMBER_OR_STRING_TYPE | typeof STRING_OR_NUMBER_TYPE;
export type NumberType = typeof NUMBER_TYPE;
export type ObjectType = typeof OBJECT_TYPE;
export type StringType = typeof STRING_TYPE;

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
