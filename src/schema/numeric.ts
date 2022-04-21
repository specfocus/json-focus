import type { JsonType } from './json';

export const INTEGER_TYPE = 'integer';
export const NUMBER_TYPE = 'number';

export type IntegerType = typeof INTEGER_TYPE;
export type NumberType = typeof NUMBER_TYPE;

export declare interface NumericJsonSchema<_partial extends boolean = false> {
  type: JsonType<NumberType | IntegerType, _partial>;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  format?: string;
}
