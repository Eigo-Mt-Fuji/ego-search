import {google, youtube_v3} from 'googleapis';
import Env from "../env";

// https://www.npmjs.com/package/googleapis
export default class YoutubeDriver {

    private client: youtube_v3.Youtube;

    public constructor(env: Env) {

        this.client = google.youtube({ version: "v3", auth: env.youtubeCredential.apiKey});
    }

    public async search(q: string = "ドラゴンボール") {

        // https://developers.google.com/youtube/v3/docs/search/list?hl=ja
        const options: youtube_v3.Params$Resource$Search$List = {
            q: q,
            part: 'id',
            fields: "items(id(videoId))",
            safeSearch: "none", 
            order: "date",
            type: "video",
            // 結果セットとして返されるアイテムの最大数を 0 以上 50 以下の値を指定 / デフォルト値は 5 
            maxResults: 10,
        };

        return await this.client.search.list(options);
    }

    public async videos(ids: string) {

        const params: youtube_v3.Params$Resource$Videos$List = {
            // https://developers.google.com/youtube/v3/docs/videos/list?hl=ja
            id: ids,
            // partとは検索結果として取得する属性を絞り込む目的で使用する単位. part指定した情報だけが返却される(partの中にはさらにfieldが定義されている)
            part: "id,snippet,statistics,contentDetails"
        };
        return await this.client.videos.list(params);
    }
}