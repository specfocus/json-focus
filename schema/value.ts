import { NUMBER_TYPE } from './number';
import { STRING_TYPE } from './string';

export const NUMBER_OR_STRING_TYPE = [NUMBER_TYPE, STRING_TYPE];
export const STRING_OR_NUMBER_TYPE = [STRING_TYPE, NUMBER_TYPE];

export type NumberOrStringType = typeof NUMBER_OR_STRING_TYPE | typeof STRING_OR_NUMBER_TYPE;
