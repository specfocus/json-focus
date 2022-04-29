import parse from './parse';

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
    const output = await parse(fakeAsync(JSON.stringify(100)));
    expect(output).toEqual(100);
  });

  it('should parse float', async () => {
    const output = await parse(fakeAsync(JSON.stringify(100.67)));
    expect(output).toEqual(100.67);
  });

  it('should parse string', async () => {
    const output = await parse(fakeAsync(JSON.stringify('hello')));
    expect(output).toEqual('hello');
  });

  it('should parse boolean', async () => {
    const output = await parse(fakeAsync(JSON.stringify(true)));
    expect(output).toEqual(true);
  });

  it('should parse array', async () => {
    const output = await parse(fakeAsync(JSON.stringify(array)));
    expect(output).toEqual(array);
  });

  it('should parse object', async () => {
    const output = await parse(fakeAsync(JSON.stringify(json)));
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
