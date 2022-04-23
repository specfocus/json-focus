import Tokenizer, { Token } from './tokenizer';

async function* generator(source: AsyncIterable<string | Buffer>): AsyncGenerator<Token> {
  const parser = new Tokenizer();
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