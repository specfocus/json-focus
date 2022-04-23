import { isArray } from '@specfocus/main-focus/src/array';
import { isAsyncIterable } from '@specfocus/main-focus/src/iterable';
import { isUndefined } from '@specfocus/main-focus/src/maybe';
import { SimpleType } from '@specfocus/main-focus/src/object';
import iterate from './iterate';

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

describe('Async JSON Perser', () => {
  it('should parse integer', async () => {
    const output = await test(JSON.stringify(100));
    expect(output).toEqual(100);
  });

  it('should parse float', async () => {
    const output = await test(JSON.stringify(100.67));
    expect(output).toEqual(100.67);
  });

  it('should parse string', async () => {
    const output = await test(JSON.stringify('hello'));
    expect(output).toEqual('hello');
  });

  it('should parse boolean', async () => {
    const output = await test(JSON.stringify(true));
    expect(output).toEqual(true);
  });

  it('should parse array', async () => {
    const output = await test(JSON.stringify(array));
    expect(output).toEqual(array);
  });

  it('should parse object', async () => {
    const output = await test(JSON.stringify(json));
    expect(output).toEqual(json);
  });
});

async function* fakeAsync(test: string): AsyncGenerator<string, void, any> {
  let index = 0;
  for (index = 0; index < test.length; index++) {
    const len = 5 + Math.random() * 10;
    const part = test.substring(index, index + len + 1);
    index += len;
    yield part;
  }
}

const test = async (json: string): Promise<Array<SimpleType>> => {
  let result: any;
  const asyncIterable = fakeAsync(json);
  if (isAsyncIterable(asyncIterable)) {
    const tokens = iterate(asyncIterable);
    for await (const token of tokens) {
      switch (token.type) {
        case 'array':
          result = [];
          break;
        case 'entry':
          result[token.key] = token.value;
          break;
        case 'item':
          result[token.index] = token.value;
          break;
        case 'shape':
          result = {};
          break;
        case 'value':
          result = token.value;
      }
    }
  }
  return result;
};
