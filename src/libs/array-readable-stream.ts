import { Readable, ReadableOptions } from "stream";

export default class ArrayStream extends Readable {
    constructor(private array: any[], private eol: string, opts?: ReadableOptions) {
      super(opts);
    }
    public _read() {

        const data = this.array.shift();
        if (data === this.eol) {
            this.push(data);
        } else {

            if (data) {
                this.push(JSON.stringify(data));
            } else {
                this.push(null);
            }
        }
    }
}
