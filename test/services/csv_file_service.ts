import {assert} from "chai";

import CsvFileService from "../../src/services/csv_file_service";
import S3Driver from "../../src/libs/s3-driver";
import * as fs from "fs";
import { Writable, WritableOptions } from "stream";
import * as sinon from "sinon";

class BufferWritableStream extends Writable {
    
    public constructor(public buffer: any[], opts?: WritableOptions | undefined) {
      super(opts)
    }
    public _write(chunk: any, encoding: string, callback: () => void) {
      this.buffer.push(chunk);
      callback();
    }
}

describe("CsvFileService", () => {
    it("正常系", async () => {

        const csvFileService
          = new CsvFileService("/tmp/test-append-records", "test.csv", "test", new S3Driver("test-bucket"), [
            {
                label: "id",
                value: "Id",
            },
            {
                label: "flag",
                value: "",
                default: "TRUE",
            },
          ]);
        const csvBufferStream1 = new BufferWritableStream([], {
           objectMode: true,
        });
        const csvBufferStream2 = new BufferWritableStream([], {
            objectMode: true,
        });
        const csvBufferStream3 = new BufferWritableStream([], {
            objectMode: true,
        });
        const csvFileServiceMock = sinon.mock(csvFileService);
        const createOutputStreamStub
           = csvFileServiceMock.expects("createOutputStream").thrice().withArgs(
               "/tmp/test-append-records/test.csv");
        createOutputStreamStub.onFirstCall().returns(csvBufferStream1);
        createOutputStreamStub.onSecondCall().returns(csvBufferStream2);
        createOutputStreamStub.onThirdCall().returns(csvBufferStream3);
 
        const checkFileExistsStub
            = csvFileServiceMock.expects("checkFileExists").thrice().withArgs(
                "/tmp/test-append-records/test.csv");
        checkFileExistsStub.onFirstCall().resolves(false);
        checkFileExistsStub.onSecondCall().resolves(true);
        checkFileExistsStub.onThirdCall().resolves(true);

        await csvFileService.appendRecords([
            {
                "Id": "test1@gmail.com",
            },
            {
                "Id": "test2@gmail.com",
            },
            {
                "Id": "test3@gmail.com",
            }
        ]);
        
        await csvFileService.appendRecords([
            {
                "Id": "test4@gmail.com",
            },
            {
                "Id": "test5@gmail.com",
            },
        ]);
        await csvFileService.appendLine();

        const actual: string = csvBufferStream1.buffer.join("") + csvBufferStream2.buffer.join("") + csvBufferStream3.buffer.join("");
        const expected: string  = ["id,flag","test1@gmail.com,TRUE","test2@gmail.com,TRUE","test3@gmail.com,TRUE","test4@gmail.com,TRUE","test5@gmail.com,TRUE"].join(CsvFileService.FILE_EOL) + CsvFileService.FILE_EOL;

        assert.deepEqual(actual, expected);
    });
});