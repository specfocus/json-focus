import { Tokenizer } from './tokenizer';
import { Through } from '@specfocus/main-focus/src/through';
import { Any } from '../any';

const bufferFrom = Buffer.from && Buffer.from !== Uint8Array.from;

const parse = (path: string | string[], map) => {
  let header, footer;
  let parser = new Tokenizer();
  const transform = (chunk) => {
    if ('string' === typeof chunk)
      chunk = bufferFrom ? Buffer.from(chunk) : new Buffer(chunk);
    parser.tokenize(chunk);
  };

  const stream = new Through(
    transform,
    (data) => {
      if (data)
        stream.write(data);
      if (header)
        stream.emit('header', header);
      if (footer)
        stream.emit('footer', footer);
      stream.queue(null);
    }
  );

  if ('string' === typeof path) {
    path = path.split('.').map(e => {
      if (e === '$*')
        return { emitKey: true };
      else if (e === '*') {
        return true;
      }
      else if (e === '') {// '..'.split('.') returns an empty string
        return { recurse: true };
      }
      else {
        return e;
      }
    });
  }


  let count = 0, _key;
  if (!path || !path.length) {
    path = null;
  }

  parser.onValue = function (value) {
    if (!this.root)
      stream.root = value;

    if (!path) return;

    let i = 0; // iterates on path
    let j = 0; // iterates on stack
    let emitKey = false;
    let emitPath = false;
    while (i < path.length) {
      const key = path[i];
      let c;
      j++;

      if (key && !key.recurse) {
        c = (j === this.stack.length) ? this : this.stack[j];
        if (!c) return;
        if (!check(key, c.key)) {
          setHeaderFooter(c.key, value);
          return;
        }
        emitKey = !!key.emitKey;
        emitPath = !!key.emitPath;
        i++;
      } else {
        i++;
        let nextKey = path[i];
        if (!nextKey) return;
        while (true) {
          c = (j === this.stack.length) ? this : this.stack[j];
          if (!c) return;
          if (check(nextKey, c.key)) {
            i++;
            if (!Object.isFrozen(this.stack[j]))
              this.stack[j].value = null;
            break;
          } else {
            setHeaderFooter(c.key, value);
          }
          j++;
        }
      }

    }

    // emit header
    if (header) {
      stream.emit('header', header);
      header = false;
    }
    if (j !== this.stack.length) {
      return;
    }

    count++;
    const actualPath = this.stack.slice(1).map(element => element.key).concat([this.key]);
    let data = value;
    if (null != data) {
      data = map ? map(data, actualPath) : data;
      if (null != data) {
        if (emitKey || emitPath) {
          data = { value: data };
          if (emitKey)
            data.key = this.key;
          if (emitPath)
            data.path = actualPath;
        }
        stream.queue(data);
      }
    }
    if (this.value) delete this.value[this.key];
    for (const k in this.stack) {
      if (!Object.isFrozen(this.stack[k])) {
        this.stack[k].value = null;
      }
    }
  };
  parser._onToken = parser.onToken;

  parser.onToken = function (token, value) {
    parser._onToken(token, value);
    if (this.stack.length === 0) {
      if (stream.root) {
        if (!path)
          stream.queue(stream.root);
        count = 0;
        stream.root = null;
      }
    }
  };

  parser.onError = function (err) {
    if (err.message.indexOf("at position") > -1)
      err.message = "Invalid JSON (" + err.message + ")";
    stream.emit('error', err);
  };

  return stream;

  function setHeaderFooter(key, value) {
    // header has not been emitted yet
    if (header !== false) {
      header = header || {};
      header[key] = value;
    }

    // footer has not been emitted yet but header has
    if (footer !== false && header === false) {
      footer = footer || {};
      footer[key] = value;
    }
  }
};

function check(x: any, y: any): any {
  if ('string' === typeof x)
    return y == x;
  else if (x && 'function' === typeof x.exec)
    return x.exec(y);
  else if ('boolean' === typeof x || 'object' === typeof x)
    return x;
  else if ('function' === typeof x)
    return x(y);
  return false;
}

export const stringify = (op, sep, cl, indent) => {
  indent = indent || 0;
  if (op === false) {
    op = '';
    sep = '\n';
    cl = '';
  } else if (op == null) {
    op = '[\n';
    sep = '\n,\n';
    cl = '\n]\n';
  }

  //else, what ever you like

  let stream
    , first = true
    , anyData = false;
  stream = new Through(
    (data) => {
      anyData = true;
      let json!: string;
      try {
        json = JSON.stringify(data, null, indent);
      } catch (err) {
        return stream.emit('error', err);
      }
      if (first) {
        first = false; stream.queue(op + json);
      }
      else {
        stream.queue(sep + json);
      }
    },
    (data) => {
      if (!anyData) {
        stream.queue(op);
      }
      stream.queue(cl);
      stream.queue(null);
    }
  );
  return stream;
};

export const stringifyObject = (op, sep, cl, indent) => {
  indent = indent || 0;
  if (op === false) {
    op = '';
    sep = '\n';
    cl = '';
  } else if (op == null) {
    op = '{\n';
    sep = '\n,\n';
    cl = '\n}\n';
  }

  // else, what ever you like

  let first = true;
  let anyData = false;
  const stream = new Through(
    (data) => {
      anyData = true;
      const json = JSON.stringify(data[0]) + ':' + JSON.stringify(data[1], null, indent);
      if (first) {
        first = false;
        stream.queue(op + json);
      }
      else {
        stream.queue(sep + json);
      }
    },
    (data) => {
      if (!anyData) {
        stream.queue(op);
      }
      stream.queue(cl);

      stream.queue(null);
    });

  return stream;
};