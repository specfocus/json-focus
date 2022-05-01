import { Fallacy, Flag, Token, Tokenizer } from './tokenizer';

/** API */
export default class Streamify implements UnderlyingSource<Token | Fallacy> {
  constructor(
    public reader: ReadableStreamReader<Uint8Array>,
    public flags: Set<Flag>
  ) {
  }

  get type(): undefined { return; }

  cancel(reason?: any): void | PromiseLike<void> {
    // TODO: listen to cancellation
    console.log('CANCEL!!!');
  }

  start(controller: ReadableStreamController<Token | Fallacy>): any {
    const tokenizer = new Tokenizer(this.flags);
    // The following function handles each data chunk
    const push = () => {
      // The `read()` method returns a promise that
      // resolves when a value has been received.
      this.reader.read().then(({ done, value }) => {
        // Result objects contain two properties:
        // `done`  - `true` if the stream has already given you all its data.
        // `value` - Some data. Always `undefined` when `done` is `true`.
        if (value) {
          for (const token of tokenizer.tokenize(value)) {
            if (token.type === 'error') {
              controller.error(token);
              controller.close();
              break;
            }
            controller.enqueue(token);
          }
        }

        // If there is no more data to read
        if (done) {
          for (const token of tokenizer.flush()) {
            controller.enqueue(token);
          }
          controller.close();
        }
        push();
      });
    };
    push();
  }
}
