import { isUndefined } from '@specfocus/main-focus/src/maybe';
import { SimpleType } from '@specfocus/main-focus/src/object';
import Parser from './Parser';

async function* generator(source: AsyncIterable<string>): AsyncGenerator<any> {
  const parser = new Parser();
  try {
    for await (const fragment of source) {
      for (const node of parser.pipe(fragment)) {
        yield node;
      }
    }
  }
  catch (e) {
    throw e;
  } finally {
    if (parser.string && parser.string.length) {
      if (!Number.isNaN(Number(parser.string))) {
        yield { type: 'value', value: Number(parser.string) };
      }
    }
  }
}

export default generator;