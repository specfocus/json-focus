import { Any } from '../any';
import { NUMBER3, Tokenizer } from './tokenizer';
import type { Token } from './tokenizer';

export const parse = (source: AsyncIterable<Uint8Array>) => new Promise<Any>(
  async (resolve, reject) => {
    let token!: Token;
    let count = 0;
    const tokenizer = new Tokenizer();
    for await (const chunk of source) {
      for (token of tokenizer.tokenize(chunk)) {
        if (token.type === 'error') {
          reject(token);
          return;
        }
        count++;
      }
    }
    switch (token?.type) {
      case 'array':
      case 'shape':
      case 'value':
        resolve(token.value);
        break;
      default:
        if (count === 0 && tokenizer.string?.length > 0 && tokenizer.tState === NUMBER3) {
          resolve(Number(tokenizer.string));
        } else {
          resolve(undefined);
        }
        break;
    }
  }
);

export default parse;
