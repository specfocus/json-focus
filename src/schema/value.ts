import { NUMBER_TYPE } from './numeric';
import { STRING_TYPE } from './string';

export const NUMBER_OR_STRING_TYPE = [NUMBER_TYPE, STRING_TYPE];
export const STRING_OR_NUMBER_TYPE = [STRING_TYPE, NUMBER_TYPE];

export type NumberOrStringType = typeof NUMBER_OR_STRING_TYPE | typeof STRING_OR_NUMBER_TYPE;

export type NumberOrString = number | string;
export type Value = boolean | NumberOrString;