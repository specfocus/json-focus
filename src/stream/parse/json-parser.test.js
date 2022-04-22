const array = require('./array-example.json');
const json = require('./json-example.json');
const { merge, test } = require('./helpers');

// the parser should iterate tuples [value, key] for objects and [value] for arrays

describe('JSON Perser', () => {
  it('should parse integer', async () => {
    const output = await test(JSON.stringify(100));
    expect(output).toEqual([100]);
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
    console.log(JSON.stringify(output));
    expect(output).toEqual([true]);
  });

  it('should parse array', async () => {
    const output = await test(JSON.stringify(array));
    console.log(JSON.stringify(JSON.stringify(output)));
    // expect(output).toEqual([[], [{ name: 'Lucas' }, 0], [{ last: 'Oromi', age: 44 }, 1]]);
    expect(merge(output)).toEqual(array);
  });

  it('should parse object', async () => {
    const output = await test(JSON.stringify(json));
    console.log(JSON.stringify(JSON.stringify(output)));
    // expect(output).toEqual([{}, ['Lucas', 'first-name'], ['Oromi', 'last-name']]);
    expect(merge(output)).toEqual(json);
  });
});