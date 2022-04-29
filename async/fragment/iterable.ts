import { Flag, NO_ROOT_ARRAY, NO_ROOT_SHAPE, NUMBER3 } from 'async/tokenizer';
import iterate from '../iterate';
import { Any } from '../../any';

export default async function* generator(
  source: AsyncIterable<Uint8Array>, ...flags: Flag[]
): AsyncGenerator<Token> {
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

const test = async (
  source: AsyncIterable<Uint8Array>
): Promise<Any> => {
  let result: any;
  const tokens = iterate(source, NO_ROOT_ARRAY, NO_ROOT_SHAPE);
  for await (const token of tokens) {
    switch (token.type) {
      case 'array':
        result = [];
        break;
      case 'entry':
        result[token.key] = token.value;
        break;
      case 'item':
        result[token.index] = token.value;
        break;
      case 'shape':
        result = {};
        break;
      case 'value':
        result = token.value;
    }
  };
  return result;
};