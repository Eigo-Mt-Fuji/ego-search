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
        this.keywordContext = env.egoSearchContext;
    }

    /**
     * run
     */
    public async run(userName: string) {

        // TODO: エゴサーチ履歴キーを生成して履歴テーブルに登録
        const historyKey = `egosearch_${this.keywordContext.channelId}_${new Date().toString()}`;
        console.log(historyKey);

        // TODO: ユーザ名を元にテーブルからチャンネルIDを取得
        const channelId = this.keywordContext.channelId;

        // チャンネルIDからYoutube動画IDリストを抽出
        const searchResult = await this.youtubeDriver.searchVideoIds(channelId);
        if (searchResult.data.items) {
            const videoIdsCsv = searchResult.data.items.map((item: any) => {

                return item.id.videoId;
            }).join(",");

            // Youtube動画ごとの評価情報を取得
            const videos = await this.youtubeDriver.videos(videoIdsCsv);

            if (videos.data.items != null) {
                
                //TODO: Youtube動画ごとの評価情報をDB登録(id,snippet.channelId,snippet.title,snippet.description,snippet.publishedAt,statistics.viewCount,statistics.likeCount,statistics.dislikeCount,statistics.favoriteCount)statistics.commentCount)
                console.log(videos.data.items);
                
                for (const itemIndex in videos.data.items) {
                    const item = videos.data.items[itemIndex];
                    if(item.snippet && item.snippet.title) {

                        //TODO: 動画についてTwitter検索(動画のタイトルで検索)
                        const title = item.snippet.title;
                        const tweetResult = await this.twitterDriver.searchTweet(title);

                        //TODO: Twitter検索結果をDB登録
                        console.log(JSON.stringify(tweetResult.statuses));
                        tweetResult.statuses.map((context: any, index: number) => {
                            const retweet_count = context.retweet_count ; // : 0,
                            const favorite_count = context.favorite_count; // : 0,
                            const favorited = context.favorited ; // false,
                            const retweeted = context.retweeted ; // false,
                            const text = context.text; // 'みんなからの匿名質問を募集中！\n\nこんな質問に答えてるよ\n● ドラゴンボールで好きなキャラは…\n● ゲーマーカップルどう思う？…\n● 人生でこれだけは譲れない！みた…\n● 今一番欲しいものは何？…\n#質問箱 #匿名質問募集中\n\nhttps://t.co/WFiTkLIBz4',
                            const created_at = context.created_at; // 'Mon Oct 07 11:52:10 +0000 2019',
            
                            const entities = context.entities; // {"hashtags":[],"symbols":[],"user_mentions":[],"urls":[{"url":"https://t.co/etZtzYc072","expanded_url":"https://peing.net/ja/qs/475859897","display_url":"peing.net/ja/qs/475859897","indices":[64,87]}]}
                            console.log("entities="  + JSON.stringify(entities));
                            const metadata = context.metadata; // metadata={"iso_language_code":"ja","result_type":"recent"}
                            console.log("metadata="  + JSON.stringify(metadata));
                            const user = context.user; // user={"id":1041293007691997200,"id_str":"1041293007691997185","name":"まむ㌧","screen_name":"VV9kAyQu64elw58","location":"鹿児島県鹿屋市","description":"最近出戻りでバイク復活しました。\n９月鹿児島おやじファイト、鹿児島県民体育大会 ボクシング競技にて勝利を収める事ができましたｖ＾＾\n週末はサーキットによく出没してます。\nスポーツ全般に登山も好きだけど時間無くて全然出来てない・・・・\nあとオールデイズな洋服好きです！\n\n現在鹿児島は鹿屋市にて勤務中。","url":null,"entities":{"description":{"urls":[]}},"protected":false,"followers_count":79,"friends_count":102,"listed_count":0,"created_at":"Sun Sep 16 11:49:34 +0000 2018","favourites_count":441,"utc_offset":null,"time_zone":null,"geo_enabled":false,"verified":false,"statuses_count":2164,"lang":null,"contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"F5F8FA","profile_background_image_url":null,"profile_background_image_url_https":null,"profile_background_tile":false,"profile_image_url":"http://pbs.twimg.com/profile_images/1041294587745034241/fbyjtOYm_normal.jpg","profile_image_url_https":"https://pbs.twimg.com/profile_images/1041294587745034241/fbyjtOYm_normal.jpg","profile_link_color":"1DA1F2","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"has_extended_profile":true,"default_profile":true,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false,"translator_type":"none"}
                            console.log("user="  + JSON.stringify(user)); // 
                            const geo = context.geo ; // : null,
                            console.log("geo="  + JSON.stringify(geo));
                            const possibly_sensitive = context.possibly_sensitive; // false,
                            const id = context.id; // 1181175379903385600,
                            const id_str = context.id_str; // '1181175379903385600',
                            const truncated = context.truncated ; // false,
                            const source = context.source; //: '<a href="https://peing.net" rel="nofollow">Peing</a>',
                            const in_reply_to_status_id = context.in_reply_to_status_id; //: null,
                            const in_reply_to_status_id_str = context.in_reply_to_status_id_str; // null,
                            const in_reply_to_user_id = context.in_reply_to_user_id; // null,
                            const in_reply_to_user_id_str = context.in_reply_to_user_id_str; // null,
                            const in_reply_to_screen_name = context.in_reply_to_screen_name; // null,
                            const coordinates = context.coordinates ; // : null,
                            const place = context.place ;// : null,
                            const contributors = context.contributors ; //: null,
                            const is_quote_status = context.is_quote_status ; //: false,
                            const lang = context.lang; //'ja'
                        });
                    }
                }
            }
        }
    }
}
