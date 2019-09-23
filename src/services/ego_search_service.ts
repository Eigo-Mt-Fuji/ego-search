import * as moment from "moment";
import Env from "../env";
import CsvFileService from "./csv_file_service";
import TwitterDriver from "../libs/twitter-driver";
import YoutubeDriver from "../libs/youtube-driver";

export default class EgoSearchService {

    private twitterApiKey: string;
    private youtubeApiKey: string;
    private keywordContext: any;
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
        private twitterDriver: TwitterDriver,
        private youtubeDriver: YoutubeDriver,
    ) {
        this.twitterApiKey = env.twitterCredential.apiKey;
        this.youtubeApiKey = env.youtubeCredential.apiKey;
        this.keywordContext = env.egoSearchKeyword;
    }

    /**
     * run
     */
    public async run() {
        // ローカルディレクトリ作成
        await this.csvFileService.createLocalDir();

        const searchResult = await this.youtubeDriver.search(this.keywordContext.q);
        if (searchResult.data.items) {
            console.log(searchResult.data.items);

            const videoIdsCsv = searchResult.data.items.map((item: any) => {

                return item.id.videoId;
            }).join(",");
            const videoIds = searchResult.data.items.map((item: any) => {

                return {video_id: item.id.videoId};
            });
            console.log("videoidsCsv");
            console.log(videoIdsCsv);
            console.log("videos search by ids");
            const videos = await this.youtubeDriver.videos(videoIdsCsv);
            console.log(videos.data.items);

            await this.csvFileService.appendRecords(videoIds);
        }
        
        const tweetResult = await this.twitterDriver.searchTweet(this.keywordContext.q);
        console.log(tweetResult);

        // TODO: 改行
        await this.csvFileService.appendLine();

        // CSVアップロード
        await this.csvFileService.uploadFile();

        // ローカルファイル削除
        await this.csvFileService.removeLocalFile();
    }
}
