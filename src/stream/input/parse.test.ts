import { isArray } from '@specfocus/main-focus/src/array';
import { isAsyncIterable } from '@specfocus/main-focus/src/iterable';
import { isUndefined } from '@specfocus/main-focus/src/maybe';
import { SimpleType } from '@specfocus/main-focus/src/object';
import parser from './parse';

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
    console.log(JSON.stringify(output));
    expect(output).toEqual(true);
  });

  it('should parse array', async () => {
    const output = await test(JSON.stringify(array));
    console.log(JSON.stringify(JSON.stringify(output)));
    // expect(output).toEqual([[], [{ name: 'Lucas' }, 0], [{ last: 'Oromi', age: 44 }, 1]]);
    expect(output).toEqual(array);
  });

  it('should parse object', async () => {
    const output = await test(JSON.stringify(json));
    console.log(JSON.stringify(JSON.stringify(output)));
    // expect(output).toEqual([{}, ['Lucas', 'first-name'], ['Oromi', 'last-name']]);
    expect(output).toEqual(json);
  });
});

async function* generate(test: string): AsyncGenerator<string, void, any> {
  let index = 0;
  for (index = 0; index < test.length; index++) {
    const len = 5 + Math.random() * 10;
    const part = test.substring(index, index + len + 1);
    index += len;
    yield part;
  }
}

const test = async (test: string): Promise<Array<SimpleType>> => {
  let result: any;
  const iterable = generate(test);
  if (isAsyncIterable(iterable)) {
    const iterable2 = parser(iterable);
    for await (const part of iterable2) {
      console.log(part);
      switch (part.type) {
        case 'array':
          result = [];
          break;
        case 'entry':
          Object.assign(result, { [part.key]: part.value });
          break;
        case 'item':
          result.push(part.value);
          break;
        case 'map':
          result = {};
          break;
        case 'value':
          result = part.value;
      }
    }
  }
  return result;
};

const merge = (output: unknown): unknown => {
  if (!isArray(output)) {
    return output;
  }
  const [obj]: any = output;

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
};
