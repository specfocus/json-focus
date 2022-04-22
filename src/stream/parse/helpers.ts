import { isArray } from '@specfocus/spec-focus/array';
import { isAsyncIterable } from '@specfocus/spec-focus/iterable';
import { isUndefined } from '@specfocus/spec-focus/maybe';
import { SimpleType } from '@specfocus/spec-focus/object';
import generator from './async-parser';
import { Tuple } from '@specfocus/spec-focus/json/TupleParser';

export async function* generate(test: string): AsyncGenerator<string, void, any> {
  let index = 0;
  for (index = 0; index < test.length; index++) {
    const len = 5 + Math.random() * 10;
    const part = test.substring(index, index + len + 1);
    index += len;
    yield part;
  }
}

export const test = async (test: string): Promise<Array<SimpleType | Tuple>> => {
  const tuples: Array<SimpleType | Tuple> = [];
  const iterable = generate(test);
  if (isAsyncIterable(iterable)) {
    const iterable2 = generator(iterable);
    for await (const item of iterable2) {
      tuples.push(item);
    }
  }
  return tuples;
};

export const merge = (output: unknown): unknown => {
  if (!isArray(output)) {
    return output;
  }
  const [obj] = output;

  if (obj === null || typeof obj !== 'object') {
    return output;
  }

  for (let i = 1; i < output.length; i++) {
    const item = output[i];
    if (isArray(item)) {
      const [key, val] = item;
      if (!isUndefined(key)) {
        obj[key as any] = val;
      }
    }
  }
  return obj;
}
