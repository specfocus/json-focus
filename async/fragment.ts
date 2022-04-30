import type { Flag, Token } from './tokenizer';
import tokenize from './tokenizer';

/** JSONStream */
export default async function* generator(source: AsyncIterable<Uint8Array>): AsyncGenerator<Token> {
  for await (const token of tokenize(source)) {
    if (token.type === 'error') {
      return token;
    }
    switch (token?.type) {
      case 'array':
      case 'shape':
      case 'value':
        break;
    }
    yield token;
  }
}
