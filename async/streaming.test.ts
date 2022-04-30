import { isAsyncIterable } from '@specfocus/main-focus/src/iterable';
import { Any } from '../any';
import { fakeAsync } from './tokenize.test';
import tokenize, { STREAMING } from './tokenizer';
import { NO_ROOT_ARRAY, NO_ROOT_SHAPE } from './tokenizer';

const array = [
  { "name": "Lucas" },
  { "last": "Oromi", "age": 44 },
  [
    "this is a good time to be alive",
    77,
    true,
    false,
    234234.3434
  ],
  4545.433
];

const json = {
  "first-name": "Lucas",
  "last-name": "Oromi",
  "this-is-an-array": [
    "hello",
    24.234,
    "good bye",
    true,
    false
  ],
  "age": 55.3
};

describe('Async JSON streamminf', () => {
  it('should parse integer', async () => {
    const arr = [100, 'hello', true, 100.67];
    const output = await test(arr.map(v => JSON.stringify(v)).join(' '));
    expect(output).toEqual(arr);
  });

  it('should parse float', async () => {
    const output = await test(JSON.stringify(100.67));
    expect(output).toEqual([100.67]);
  });

  it('should parse string', async () => {
    const output = await test(JSON.stringify('hello'));
    expect(output).toEqual(['hello']);
  });

  it('should parse boolean', async () => {
    const output = await test(JSON.stringify(true));
    expect(output).toEqual([true]);
  });

  it('should parse array', async () => {
    const arr = [array, json, array, 'hello', true, 65675];
    const output = await test(arr.map(v => JSON.stringify(v)).join(' '));
    expect(output).toEqual(arr);
  });

  it('should parse object', async () => {
    const output = await test(JSON.stringify(json));
    expect(output).toEqual([json]);
  });
});

const test = async (json: string): Promise<Array<Any>> => {
  let result: any[] = [];
  const asyncIterable = fakeAsync(json);
  if (isAsyncIterable(asyncIterable)) {
    const tokens = tokenize(asyncIterable, STREAMING);
    for await (const token of tokens) {
      if (token.type === 'error') {
        break;
      }
      result.push(token.value);
    }
  }
  return result;
};
