import { isAsyncIterable } from '@specfocus/main-focus/src/iterable';
import { Any } from '../any';
import iterate from './fragment';
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

async function* fakeAsync(test: string): AsyncGenerator<Uint8Array, void, any> {
  let index = 0;
  for (index = 0; index < test.length; index++) {
    const len = 5 + Math.random() * 10;
    const part = test.substring(index, index + len + 1);
    index += len;
    yield Buffer.from(part);
  }
}

const test = async (json: string): Promise<Array<Any>> => {
  let result: any;
  const asyncIterable = fakeAsync(json);
  if (isAsyncIterable(asyncIterable)) {
    const tokens = iterate(asyncIterable, NO_ROOT_ARRAY, NO_ROOT_SHAPE);
    for await (const token of tokens) {
      if (token.type === 'error') {
        break;
      }
      const { path, type, value } = token;
      if (path?.length == 0) {
        switch(type) {
          case 'array':
            result = [];
            break;
          case 'shape':
            result = {};
            break;
          case 'value':
            result = value;
            break;
        }
      } else if (path?.length === 1) {
        const key = path[0];
        result[key] = value;
      }
    }
  }
  return result;
};
