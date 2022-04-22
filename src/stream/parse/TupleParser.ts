import { isUndefined } from '@specfocus/main-focus/src/maybe';
import { SimpleType } from '@specfocus/main-focus/src/object';
import { LEFT_BRACE, LEFT_BRACKET, Parser } from './Parser';

export type Tuple = [number | string, SimpleType];

export class TupleParser extends Parser {
  tuples: (SimpleType | Tuple)[] = [];

  public onValue(value: SimpleType) {
    if (this.stack.length === 1) {
      if (!isUndefined(this.key)) {
        this.tuples.push([this.key, value]);
        console.log(JSON.stringify(this.tuples));
      } else {
        this.tuples.push(value);
        console.log(JSON.stringify(this.tuples));
      }
    } else if (this.stack.length === 0) {
      if (this.tuples.length === 0) {
        this.tuples.push(value);
        console.log(JSON.stringify(this.tuples));
      }
    }
  }

  onToken(token: any, value: any) {
    if (this.stack.length === 0) {
      if (token === LEFT_BRACE) {
        this.tuples.push({});
      } else if (token === LEFT_BRACKET) {
        this.tuples.push([]);
      }
    }
    super.onToken(token, value);
  }
}