import type { Flag, Token } from './tokenizer';
import { NUMBER3, Tokenizer } from './tokenizer';

/** https://en.wikipedia.org/wiki/JSON_streaming */
export default async function* generator(source: AsyncIterable<Uint8Array>, ...flags: Flag[]): AsyncGenerator<Token> {
  const tokenizer = new Tokenizer(['streaming']);
  for await (const chunk of source) {
    for (const token of tokenizer.tokenize(chunk)) {
      if (token.type === 'error') {
        return token;
      }
      if (token.path.length === 0) {
        yield token;
      }
    }
  }
  if (tokenizer.string?.length > 0 && tokenizer.tState === NUMBER3) {
    const value = Number(tokenizer.string);
    if (!Number.isNaN(value)) {
      yield { type: 'value', path: [], value };
    }
  }
}
