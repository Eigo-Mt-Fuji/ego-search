import { Writable, WritableOptions } from "stream";

export default class ArrayWritableStream extends Writable {

    public constructor(public buffer: any[], opts?: WritableOptions | undefined) {
      super(opts);
    }
    public _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
      this.buffer.push(chunk);
      callback();
    }
    public toString(): string {

        return this.buffer.join("");
    }
}
