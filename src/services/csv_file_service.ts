import * as fs from "fs";
import json2csv, {Parser, Transform} from "json2csv";
import S3Driver from "../libs/s3-driver";
import ArrayReadableStream from "../libs/array-readable-stream";
import ArrayWritableStream from "../libs/array-writable-stream";

export default class CsvFileService {

    public static get FILE_ENCODING(): string {

        return "utf-8";
    }
    public static get FILE_EOL(): string {

        return "\r\n";
    }

    /**
     * constructor
     */
    public constructor(
        private localTmpDir: string,
        private fileName: string,
        private s3Prefix: string,
        private s3Driver: S3Driver,
        private fields: any[]) {
    }

    /**
     * createLocalDir
     */
    public async createLocalDir(): Promise<any> {

        return new Promise((resolve, reject) => {
            fs.mkdir(`${this.localTmpDir}/`, (err: NodeJS.ErrnoException) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * removeLocalFile
     */
    public removeLocalFile() {
        return new Promise((resolve, reject) => {
            fs.unlink(this.getLocalFilePath(), (err: NodeJS.ErrnoException) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * appendRecords
     * @param records
     */
    public async appendRecords(records: any[]): Promise<any> {

        return new Promise( async (resolve, reject) => {
            // ローカルCSVファイルが存在チェック
            const filePath: string = this.getLocalFilePath();
            const exists: boolean = await this.checkFileExists(filePath);

            // CSV処理/変換オプション作成
            // ファイル存在しない場合のみCSV出力時にヘッダを付与／以降はヘッダなし
            // CSV変換のバッファしきい値（1MB）, 文字変換コード(UTF-8, BOMなし)を設定
            const opts = this.getCsvOps(!exists ? true : false);
            const transformOpts = { highWaterMark: 1 * 1024 * 1024, encoding: CsvFileService.FILE_ENCODING };
            const transform = new Transform(opts, transformOpts);

            // 出力用ストリーム作成
            const arrayWritableStream = this.createArrayWritableStream(exists ? [CsvFileService.FILE_EOL] : []);
            arrayWritableStream.on("error", (err: Error) => {

                reject(err);
                return ;
            });
            // データ入力ストリーム生成
            const input = this.createArrayReadableStream(records);

            input.on("error", (error: any) => {

                reject(error);
            });

            // CSV変換・出力
            await input.pipe(transform).pipe(arrayWritableStream);
            arrayWritableStream.on("finish", () => {

                const output = this.createOutputStream(filePath);
                output.write(arrayWritableStream.toString(), (error: Error | null | undefined) => {

                    if (error) {

                        reject(error);
                        return;
                    }

                    resolve({});
                });
            });
        });
    }

    public async appendLine(): Promise<any> {

        return new Promise( async (resolve, reject) => {
            // 出力用ストリーム作成
            const filePath = this.getLocalFilePath();
            const output = this.createOutputStream(filePath);
            output.write(CsvFileService.FILE_EOL, (error: Error | null | undefined) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve({});
            });
        });
    }

    /**
     * createOutputStream
     * @param filePath
     * @param fileEncoding
     */
    public createOutputStream(filePath: string) {

        return fs.createWriteStream(
            filePath,
            {
                encoding: CsvFileService.FILE_ENCODING,
                flags: "a",
            },
        );
    }

    /**
     * createArrayReadableStream
     */
    public createArrayReadableStream(datas: any[]) {

        return new ArrayReadableStream(datas, CsvFileService.FILE_EOL, {objectMode: true});
    }

    /**
     * createArrayWritableStream
     * @param buffer
     */
    public createArrayWritableStream(buffer: string[]) {

        return new ArrayWritableStream(buffer, {
            objectMode: true,
        });
    }

    /**
     * uploadFile
     */
    public async uploadFile(): Promise<any> {

        // ローカルCSVファイルをオープン
        const localFilePath: string = this.getLocalFilePath();
        const stream = fs.createReadStream(localFilePath);

        // S3アップロード
        const s3FilePath: string = `${this.s3Prefix}/${this.fileName}`;
        return await this.s3Driver.putObject(stream, s3FilePath);
    }
    public getS3Path(): string {

        return `${this.s3Prefix}/${this.fileName}`;
    }
    /**
     * getLocalFilePath
     */
    public getLocalFilePath() {

        return `${this.localTmpDir}/${this.fileName}`;
    }
    /**
     * getS3URL
     */
    public getS3URL() {

        return `s3://${this.s3Driver.bucketName}/${this.getS3Path()}`;
    }

    /**
     * getCsvOps
     * @param withHeader true | false
     */
    public getCsvOps(withHeader: boolean) {
        // CSVオプション UTF-8(BOMなし), 改行コード: LF, 囲い文字（クォーテーション）なし
        const opts: json2csv.Options<{}> = {
            delimiter: ",",
            eol: CsvFileService.FILE_EOL,
            fields: this.fields,
            header: withHeader,
            includeEmptyRows: false,
            quote: "",
            withBOM: false,
        };
        return opts;
    }

    /**
     * checkFileExists
     */
    public async checkFileExists(filePath: string): Promise<boolean> {

        return new Promise<boolean>( (resolve, reject) => {
            fs.exists(filePath, (exists: boolean) => {
                resolve(exists);
            });
        });
    }
}
