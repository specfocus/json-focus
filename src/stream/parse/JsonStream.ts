import { TransformOptions } from 'stream';
import { Through } from '@specfocus/main-focus/src/through';

export class JsonStream extends Through implements ReadableStream {
  constructor(
    transform: (chunk: any, encoding: BufferEncoding, callback: (error?: Error, data?: any) => void) => void,
    flush: (callback: (error?: Error, data?: any) => void) => void,
    options?: TransformOptions) {
    super(transform, flush, options);
    this.locked = false;
  }

  locked: boolean;

  cancel(reason?: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getReader(): ReadableStreamDefaultReader<any> {
    throw new Error('Method not implemented.');
  }
  pipeThrough<T>(transform: ReadableWritablePair<T, any>, options?: StreamPipeOptions): ReadableStream<T> {
    throw new Error('Method not implemented.');
  }
  pipeTo(destination: WritableStream<any>, options?: StreamPipeOptions): Promise<void> {
    throw new Error('Method not implemented.');
  }
  tee(): [ReadableStream<any>, ReadableStream<any>] {
    throw new Error('Method not implemented.');
  }
  forEach(callbackfn: (value: any, key: number, parent: ReadableStream<any>) => void, thisArg?: any): void {
    throw new Error('Method not implemented.');
  }
}
