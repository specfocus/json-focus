import { Any } from '../any';
import { fakeAsync } from './tokenize.test';
import { parse, STREAMING } from './tokenizer';

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

describe('Async JSON Parser', () => {
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

const test = async (json: string): Promise<Any> => {
  const token = await parse(fakeAsync(json));
  // @ts-ignore
  if (token?.type === 'error') {
    // @ts-ignore
    throw token.message;
  }
  return token?.value;
};
