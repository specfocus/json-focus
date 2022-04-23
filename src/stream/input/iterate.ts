import Parser from './parser';

async function* generator(source: AsyncIterable<string | Buffer>): AsyncGenerator<any> {
  const parser = new Parser();
  for await (const fragment of source) {
    for (const token of parser.tokenize(fragment)) {
      if (token.type === 'error') {
        return token;
      }
      yield token;
    }
  }
  if (parser.string && parser.string.length) {
    const value = Number(parser.string);
    if (!Number.isNaN(value)) {
      yield { type: 'value', value };
    }
  }
}

export default generator;