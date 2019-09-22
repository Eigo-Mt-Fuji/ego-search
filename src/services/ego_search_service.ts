import * as moment from "moment";
import Env from "../env";
import CsvFileService from "./csv_file_service";

export default class EgoSearchService {

    private twitterApiKey: string;
    private youtubeApiKey: string;

    /**
     * constructor
     * @param env
     * @param slackDriver
     * @param benchmarkApiDriver
     * @param optoutUserService
     */
    public constructor(
        env: any,
        private csvFileService: CsvFileService,
    ) {

        this.twitterApiKey = env.twitterCredential.apiKey;
        this.youtubeApiKey = env.youtubeCredential.apiKey;
    }

    /**
     * run
     */
    public async run() {

        // ローカルディレクトリ作成
        await this.csvFileService.createLocalDir();

        // TODO: APIを実行してデータを取得・順次CSVに変換
        //        await this.csvFileService.appendRecords(details.Response.Data);

        // TODO: 改行
        // await this.csvFileService.appendLine();

        // CSVアップロード
        //await this.csvFileService.uploadFile();

        // ローカルファイル削除
        await this.csvFileService.removeLocalFile();
    }
}
