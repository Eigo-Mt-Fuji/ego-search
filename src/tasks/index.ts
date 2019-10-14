import S3Driver from "../libs/s3-driver";
import Env from "../env";
import CsvFileService from "../services/csv_file_service";
import EgoSearchService from "../services/ego_search_service";
import TwitterDriver from "../libs/twitter-driver";
import YoutubeDriver from "../libs/youtube-driver";

class Task {

    public async run() {
        const env = new Env();
        const timestamp: number = Math.floor((new Date()).getTime() / 1000);
        const s3Driver: S3Driver = new S3Driver(env.egoSearchResultS3.bucketName);
        const csvFileService = new CsvFileService(
            `/tmp/ego-search-${timestamp}`, `result-${timestamp}.csv`, "out", s3Driver,
            [
                // TODO: CSVフォーマットを決める
                {
                    label: "video_id",
                    value: "video_id",
                },
            ],
        );
        const service = new EgoSearchService(env, csvFileService, new TwitterDriver(env), new YoutubeDriver(env));
        await service.run(env.egoSearchContext.userName, env.egoSearchContext.channelId);
    }
}

new Task().run().then(() => {

    console.log("完了");
}).catch((reason: any) => {

    console.log("エラー", reason);
});
