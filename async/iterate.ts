import type { Flag, Token } from './tokenizer';
import { NUMBER3, Tokenizer } from './tokenizer';

export default async function* generator(source: AsyncIterable<Uint8Array>, ...flags: Flag[]): AsyncGenerator<Token> {
  const tokenizer = new Tokenizer(flags);
  let count = 0;
  for await (const chunk of source) {
    for (const token of tokenizer.tokenize(chunk)) {
      if (token.type === 'error') {
        return token;
      }
      yield token;
      count++;
    }
  }
  if (count === 0 && tokenizer.string?.length > 0 && tokenizer.tState === NUMBER3) {
    const value = Number(tokenizer.string);
    if (!Number.isNaN(value)) {
      yield { type: 'value', value };
    }
  }
}
