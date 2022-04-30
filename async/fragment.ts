import { ARRAY_TYPE, OBJECT_TYPE } from '../schema';
import type { Flag, StateValue } from './tokenizer';
import tokenize from './tokenizer';

/** JSONStream */
export default async function* generator(source: AsyncIterable<Uint8Array>): AsyncGenerator<StateValue> {
  for await (const token of tokenize(source)) {
    // @ts-ignore
    if (token.type === 'error') {
      return token;
    }
    switch (token?.type) {
      case ARRAY_TYPE:
      case OBJECT_TYPE:
      case 'value':
        break;
    }
    yield token;
  }
}
