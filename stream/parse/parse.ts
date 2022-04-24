import { StreamParser } from './StreamParser';

const parse = (path: any, map: any): any => {
  if ('string' === typeof path)
    path = path.split('.').map((e) => {
      if (e === '$*') return { emitKey: true }
      else if (e === '*') return true
      else if (e === '')
        // '..'.split('.') returns an empty string
        return { recurse: true }
      else return e
    });

  if (!path || !path.length) {
    path = null
  }

  if (!path || !path.length) path = null

  const parser = new StreamParser(path, map);

  return parser.stream;
}

export default parse;