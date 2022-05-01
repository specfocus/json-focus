import { JsonStream } from './JsonStream';

export class Serializer {
  stream: JsonStream;
  first = true;
  anyData = false;

  constructor(public op?: any, public sep?: any, public cl?: any, public indent?: number) {
    this.indent = indent || 0
    if (op === false) {
      this.op = ''
      this.sep = '\n'
      this.cl = ''
    } else if (op == null) {
      this.op = '[\n'
      this.sep = '\n,\n'
      this.cl = '\n]\n'
    }

    this.stream = new JsonStream(this.transform, this.flush);
  }

  transform(data: any, _: any, cb: any): void {
    this.anyData = true
    let json
    try {
      json = JSON.stringify(data, null, this.indent)
    } catch (err) {
      return cb(err)
    }
    if (this.first) {
      this.first = false
      cb(null, (typeof this.op === 'function' ? this.op() : this.op) + json)
    } else {
      cb(null, this.sep + json)
    }
  }

  flush(cb: any) {
    if (!this.anyData) this.stream.push(this.op)
    if (typeof this.cl === 'function') {
      this.cl((err: any, res: any) => {
        if (err) {
          return cb(err)
        }
        this.stream.push(res);
        cb();
      })
      return;
    }
    this.stream.push(this.cl);
    cb();
  }
}
