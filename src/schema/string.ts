import type { JsonType } from './json';

export const STRING_TYPE = 'string';
export type StringType = typeof STRING_TYPE;

export declare interface StringJsonSchema<_partial extends boolean = false> {
  type: JsonType<StringType, _partial>;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
}