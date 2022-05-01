import { ARRAY_TYPE, OBJECT_TYPE } from '../../schema';
import check from './check';
import tokenize, { STREAMING, Token, Tokenizer } from '../tokenizer';

type Any = true;
type EmitKey = { emitKey: true; };
type Index = number;
type Key = string;
type Recurse = { recurse: true; };
type Node = Any | EmitKey | Index | Key | Recurse;
type Path = Node[];

/** JSONStream */
export default async function* generator(source: AsyncIterable<Uint8Array>, selector: Path, map?: (data: any, path: (number | string)[]) => void): AsyncGenerator<Token> {
  if (!selector?.length) {
    return tokenize(source, STREAMING);
  }
  let count = 0;
  const tokenizer = new Tokenizer(new Set([]));
  for await (const chunk of source) {
    for (const token of tokenizer.tokenize(chunk)) {
      if (token.type === 'error') {
        return token;
      }
      const { path, type } = token;
      const { state, stack } = tokenizer;

      console.log({ type, path});

      switch (token?.type) {
        case ARRAY_TYPE:
        case OBJECT_TYPE:
        case 'value':
          break;
      }

      let i = 0; // iterates on path
      let j = 0; // iterates on stack
      let emitKey = false;
      let emitPath = false;
      while (i < selector.length) {
        const key: any = selector[i];
        let c;
        j++;

        if (key && !key.recurse) {
          c = (j === stack.length) ? this : stack[j];
          if (!c) return;
          if (!check(key, c.key)) {
            // setHeaderFooter(c.key, value);
            return;
          }
          emitKey = !!key.emitKey;
          emitPath = !!key.emitPath;
          i++;
        } else {
          i++;
          const nextKey = selector[i];
          if (!nextKey) return;
          while (true) {
            c = (j === stack.length) ? this : stack[j];
            if (!c) return;
            if (check(nextKey, c.key)) {
              i++;
              if (!Object.isFrozen(stack[j]))
                stack[j].value = null;
              break;
            } else {
              // setHeaderFooter(c.key, value);
            }
            j++;
          }
        }
      }
      // emit header
      /*
      if (header) {
        stream.emit('header', header);
        header = false;
      }
      */
      if (j !== stack.length) {
        return;
      }

      count++;
      const actualPath = stack.slice(1).map(element => element.key).concat([state.key]);
      let data: any = token;
      if (null != data) {
        data = map ? map(data, actualPath) : data;
        if (null != data) {
          if (emitKey || emitPath) {
            data = { value: data };
            if (emitKey)
              data.key = state.key;
            if (emitPath)
              data.path = actualPath;
          }
          yield data;
        }
      }
      if (state.value) {
        delete state.value[state.key];
      }
      for (const k in stack) {
        if (!Object.isFrozen(stack[k])) {
          stack[k].value = null;
        }
      }
    }
  }
};

export const parseSelector = (s: string): Path => s.split('.').map(e => {
  if (e === '$*') {
    return { emitKey: true };
  }
  else if (e === '*') {
    return true;
  }
  else if (e === '') {// '..'.split('.') returns an empty string
    return { recurse: true };
  }
  return e;
});