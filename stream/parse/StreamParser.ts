import Tokenizer, { Token } from '../../async/tokenizer';
import { Through } from '@specfocus/main-focus/src/through';
import { Stream, Transform, TransformOptions } from 'stream';
import check from './check';

export class StreamParser extends Tokenizer {
  stream: Through;
  root?: any;
  header?: any;
  footer?: any;
  count = 0;

  setHeaderFooter(key: string, value: string) {
    // header has not been emitted yet
    if (this.header !== false) {
      this.header = this.header || {}
      this.header[key] = value
    }

    // footer has not been emitted yet but header has
    if (this.footer !== false && this.header === false) {
      this.footer = this.footer || {}
      this.footer[key] = value
    }
  }

  constructor(public path: string[], public map: any) {
    super();

    this.stream = new Through(this.transform, this.flush);
  }

  transform(chunk: string | Buffer, encoding: BufferEncoding, callback: (error?: Error, data?: Token) => void): void {
    if (typeof chunk === 'string') chunk = Buffer.from(chunk);
    const tokens = this.tokenize(chunk);
    for (const token of tokens) {
      if (token.type === 'error') {
        callback(new Error(token.message ), token);
      } else {
        callback(undefined, token);
      }
    }
  }

  flush(callback: (error?: Error, data?: Token) => void): void {
    if (this.header) {
      this.stream.emit('header', this.header);
    }
    if (this.footer) {
      this.stream.emit('footer', this.footer);
    }

    if (this.tState !== Tokenizer.C.START || this.stack.length > 0) {
      callback(new Error('Incomplete JSON'))
      return
    }
    callback()
  }

  onValue(value: any) {
    if (!this.root) {
      this.stream.root = value
    }

    if (!this.path) {
      return;
    }

    let i = 0 // iterates on path
    let j = 0 // iterates on stack
    let emitKey = false
    let emitPath = false
    while (i < this.path.length) {
      const key: any = this.path[i]
      let c
      j++

      if (key && !key.recurse) {
        c = j === this.stack.length ? this : this.stack[j]
        if (!c) return
        if (!check(key, c.key)) {
          this.setHeaderFooter(c.key, value)
          return
        }
        emitKey = !!key.emitKey
        emitPath = !!key.emitPath
        i++
      } else {
        i++
        const nextKey = this.path[i]
        if (!nextKey) return
        while (true) {
          c = j === this.stack.length ? this : this.stack[j]
          if (!c) return
          if (check(nextKey, c.key)) {
            i++
            if (!Object.isFrozen(this.stack[j])) this.stack[j].value = null
            break
          } else {
            this.setHeaderFooter(c.key, value)
          }
          j++
        }
      }
    }

    // emit header
    if (this.header) {
      this.stream.emit('header', this.header)
      this.header = false
    }
    if (j !== this.stack.length) return

    this.count++
    const actualPath = this.stack
      .slice(1)
      .map(function (element: any) {
        return element.key
      })
      .concat([this.key])
    let data = value
    if (null != data)
      if (null != (data = this.map ? this.map(data, actualPath) : data)) {
        if (emitKey || emitPath) {
          data = { value: data }
          if (emitKey) data.key = this.key
          if (emitPath) data.path = actualPath
        }

        this.stream.push(data)
      }
    if (this.value) delete this.value[this.key]
    for (const k in this.stack) if (!Object.isFrozen(this.stack[k])) this.stack[k].value = null
  }

  onError(err: any) {
    if (err.message.indexOf('at position') > -1) err.message = 'Invalid JSON (' + err.message + ')'
    this.stream.destroy(err)
  }
}
