import Tokenizer, { Token } from './tokenizer';

async function* generator(source: AsyncIterable<Uint8Array>): AsyncGenerator<Token> {
  const tokenizer = new Tokenizer();
  for await (const chunk of source) {
    for (const token of tokenizer.tokenize(chunk)) {
      if (token.type === 'error') {
        return token;
      }
      yield token;
    }
  }
  if (tokenizer.string && tokenizer.string.length) {
    const value = Number(tokenizer.string);
    if (!Number.isNaN(value)) {
      yield { type: 'value', value };
    }
  }
}

export default generator;