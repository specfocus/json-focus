import { isUndefined } from '@specfocus/main-focus/src/maybe';
import { SimpleType } from '@specfocus/main-focus/src/object';
import { Tuple, TupleParser } from './TupleParser';

async function* generator(source: AsyncIterable<string>): AsyncGenerator<SimpleType | Tuple, void, any> {
  const parser = new TupleParser();
  try {
    for await (const fragment of source) {
      parser.write(fragment);
      while (parser.tuples.length) {
        const value = parser.tuples.shift();
        if (!isUndefined(value)) {
          yield value;
        }
      }
    }
  }
  catch (e) {
    throw e;
  } finally {
    if (parser.string && parser.string.length) {
      if (!Number.isNaN(parser.string)) {
        yield Number(parser.string);
      }
    }
  }
}

export default generator;