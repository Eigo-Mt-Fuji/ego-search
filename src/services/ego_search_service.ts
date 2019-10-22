import "reflect-metadata" ;
import * as moment from "moment";
import Env from "../env";
import TwitterDriver from "../libs/twitter-driver";
import YoutubeDriver from "../libs/youtube-driver";
import { getManager, Repository } from "typeorm";
import SearchHistory from "../entities/search-history";
import YoutubeVideo from "../entities/youtube-video";
import TweetStatus from "../entities/tweet-status";
import { youtube_v3 } from "googleapis";
import { GaxiosResponse } from "gaxios";

export default class EgoSearchService {

    private twitterApiKey: string;
    private youtubeApiKey: string;
    private keywordContext: any;


    /**
     * constructor
     * @param env 
     * @param twitterDriver 
     * @param youtubeDriver 
     */
    public constructor(
        env: any,
        private twitterDriver: TwitterDriver,
        private youtubeDriver: YoutubeDriver,
    ) {
        this.twitterApiKey = env.twitterCredential.apiKey;
        this.youtubeApiKey = env.youtubeCredential.apiKey;
        this.keywordContext = env.egoSearchContext;
    }

    public async insertSearchHistory(repository: Repository<SearchHistory>, model: SearchHistory) {

        try {

            await repository.insert(model);
            return true;
        }catch(err) {

            console.error(err);
            return false;
        }

    }
    public createYoutubeVideoModel(searchHistoryKey: string, item: youtube_v3.Schema$Video) : YoutubeVideo | undefined{

        try {
            
            if (!item.id ) {

                throw new Error("video idが取得できませんでした。Youtube Data APIの呼び出し箇所・仕様を確認して下さい。");
            }
    
            const snippet = item.snippet as youtube_v3.Schema$VideoSnippet;
            if (!snippet.channelId ) {
    
                throw new Error("video snippet channelIdが取得できませんでした。Youtube Data APIの呼び出し箇所・仕様を確認して下さい。");
            }
            if (!snippet.title ) {
    
                throw new Error("video snippet titleが取得できませんでした。Youtube Data APIの呼び出し箇所・仕様を確認して下さい。");
            }
            if (!snippet.description ) {
    
                throw new Error("video snippet descriptionが取得できませんでした。Youtube Data APIの呼び出し箇所・仕様を確認して下さい。");
            }
            if (!snippet.publishedAt ) {
    
                throw new Error("video snippet publishedAtが取得できませんでした。Youtube Data APIの呼び出し箇所・仕様を確認して下さい。");
            }
    
            const statistics = item.statistics as youtube_v3.Schema$VideoStatistics;
    
            return new YoutubeVideo(
                searchHistoryKey, 
                item.id, 
                snippet.channelId, 
                snippet.title, 
                snippet.description,
                snippet.publishedAt,
                parseInt(statistics.viewCount || "0"),
                parseInt(statistics.likeCount || "0"),
                parseInt(statistics.dislikeCount || "0"),
                parseInt(statistics.favoriteCount || "0"),
                parseInt(statistics.commentCount || "0"),
                JSON.stringify(item)
            );
        }catch(err) {

            console.error(err);
            throw err;
        }
    }
    public async insertYoutubeVideos(repository: Repository<YoutubeVideo>, models: YoutubeVideo[]) {
        try {
            await repository.insert(models);
            return true;
        }catch(err) {
            console.error(err);
            throw err;
        }
    }
    public createSearchHistoryKey(channelId: string, now: Date)
    {
        return `egosearch_${channelId}_${moment(now).format("YYYYMMDDhhmmss")}`
    }
    /**
     * run
     */
    public async run(userName: string, channelId: string) {

        try {

            // エゴサーチ履歴キーを生成して履歴テーブルに登録
            const searchHistoryRepo: Repository<SearchHistory> = getManager().getRepository(SearchHistory);
            const now = new Date();
            const searchHistoryKey = this.createSearchHistoryKey(channelId, now);
            const searchHistoryModel = new SearchHistory(searchHistoryKey, channelId, now);

            // チャンネルIDからYoutube動画IDリストを抽出
            const searchResult = await this.youtubeDriver.searchVideoIds(channelId);

            if (!searchResult.data.items) {
                console.error(searchResult);
                throw new Error("No items or invalid response returned from Youtube Data API.");
            }

            const videoIdsCsv = searchResult.data.items.map((item: any) => {

                return item.id.videoId;
            }).join(",");
  
            // Youtube動画ごとの評価情報を取得
            const videos: GaxiosResponse<youtube_v3.Schema$VideoListResponse> = await this.youtubeDriver.videos(videoIdsCsv);

            const youtubeVideoRepository = getManager().getRepository(YoutubeVideo);
            const tweetStatusRepository = getManager().getRepository(TweetStatus);
            if (!videos.data.items)  {
                console.error(videos);
                throw new Error(`No items or invalid response returned from Youtube Data API (video id: ${videoIdsCsv}).`);
            }
                    
            const youtubeVideoModels: YoutubeVideo[] = videos.data.items.map( (item) => {
                return this.createYoutubeVideoModel(searchHistoryKey, item);
            }).filter((model) => model !== undefined ) as YoutubeVideo[];

            // 検索履歴テーブルレコード登録
            this.insertSearchHistory(searchHistoryRepo, searchHistoryModel);
            console.log(searchHistoryModel.key);
            
            // 動画ごとの評価情報をDB登録(id,snippet.channelId,snippet.title,snippet.description,snippet.publishedAt,statistics.viewCount,statistics.likeCount,statistics.dislikeCount,statistics.favoriteCount)statistics.commentCount)
            await this.insertYoutubeVideos(youtubeVideoRepository, youtubeVideoModels);
            
            // エゴサーチ結果登録
            const tweetStatusModels: TweetStatus[] = await this.searchEgoTweet(videos.data.items, searchHistoryKey);
            await this.insertTweetStatusModels(tweetStatusRepository, tweetStatusModels);
        }catch(err) {

            console.error(err);
            throw err;
        }
    }

    public async searchEgoTweet(items: youtube_v3.Schema$Video[], searchHistoryKey: string) {
        const tweetStatusModels: TweetStatus[] = [];
        for (const item of items) {

            // Twitter検索(動画のタイトルで検索)
            if (item.snippet && item.snippet.title) {
                const models = await this.searchTweetBy(item.snippet.title, searchHistoryKey);
                tweetStatusModels.push(...models);
            }
        }
        return tweetStatusModels;
    }

    /**
     * 
     * @param title 
     * @param searchHistoryKey 
     */
    private async searchTweetBy(q: string, searchHistoryKey: string) : Promise<TweetStatus[]>{

        const tweetResult = await this.twitterDriver.searchTweet(q);
        console.log(JSON.stringify(tweetResult.statuses));

        return tweetResult.statuses.map((context: any) => {
            return this.createTweetStatusModel(searchHistoryKey, q, context);
        }).filter((model: any) => model !== undefined) as TweetStatus[];
    }

    public async insertTweetStatusModels(repository: Repository<TweetStatus>, models: TweetStatus[]) {

        try {
            await repository.insert(models);
        }catch(err) {

            console.error(err);
            throw err;
        }

    }
    public createTweetStatusModel(searchHistoryKey: string, q: string, context: any) {

        const id_str = context.id_str; // '1181175379903385600',
        const text = context.text; // 'みんなからの匿名質問を募集中！\n\nこんな質問に答えてるよ\n● ドラゴンボールで好きなキャラは…\n● ゲーマーカップルどう思う？…\n● 人生でこれだけは譲れない！みた…\n● 今一番欲しいものは何？…\n#質問箱 #匿名質問募集中\n\nhttps://t.co/WFiTkLIBz4',
        const created_at = context.created_at; // 'Mon Oct 07 11:52:10 +0000 2019',

        const user = context.user; // user={"id":1041293007691997200,"id_str":"1041293007691997185","name":"まむ㌧","screen_name":"VV9kAyQu64elw58","location":"鹿児島県鹿屋市","description":"最近出戻りでバイク復活しました。\n９月鹿児島おやじファイト、鹿児島県民体育大会 ボクシング競技にて勝利を収める事ができましたｖ＾＾\n週末はサーキットによく出没してます。\nスポーツ全般に登山も好きだけど時間無くて全然出来てない・・・・\nあとオールデイズな洋服好きです！\n\n現在鹿児島は鹿屋市にて勤務中。","url":null,"entities":{"description":{"urls":[]}},"protected":false,"followers_count":79,"friends_count":102,"listed_count":0,"created_at":"Sun Sep 16 11:49:34 +0000 2018","favourites_count":441,"utc_offset":null,"time_zone":null,"geo_enabled":false,"verified":false,"statuses_count":2164,"lang":null,"contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"F5F8FA","profile_background_image_url":null,"profile_background_image_url_https":null,"profile_background_tile":false,"profile_image_url":"http://pbs.twimg.com/profile_images/1041294587745034241/fbyjtOYm_normal.jpg","profile_image_url_https":"https://pbs.twimg.com/profile_images/1041294587745034241/fbyjtOYm_normal.jpg","profile_link_color":"1DA1F2","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"has_extended_profile":true,"default_profile":true,"default_profile_image":false,"following":false,"follow_request_sent":false,"notifications":false,"translator_type":"none"}
        console.log("user="  + JSON.stringify(user)); // 

        const retweet_count = context.retweet_count ; // : 0,
        const favorite_count = context.favorite_count; // : 0,
        const retweeted = context.retweeted ; // false,
        const favorited = context.favorited ; // false,

        const in_reply_to_status_id_str = context.in_reply_to_status_id_str || ""; // null,
        const in_reply_to_user_id_str = context.in_reply_to_user_id_str || ""; // null,
        const in_reply_to_screen_name = context.in_reply_to_screen_name || ""; // null,

        const entities = context.entities || {}; // {"hashtags":[],"symbols":[],"user_mentions":[],"urls":[{"url":"https://t.co/etZtzYc072","expanded_url":"https://peing.net/ja/qs/475859897","display_url":"peing.net/ja/qs/475859897","indices":[64,87]}]}
        console.log("entities="  + JSON.stringify(entities));

        const metadata = context.metadata || {}; // metadata={"iso_language_code":"ja","result_type":"recent"}
        console.log("metadata="  + JSON.stringify(metadata));

        const geo = context.geo || {}; // : null,
        console.log("geo="  + JSON.stringify(geo));
        const coordinates = context.coordinates || {}; // : {"coordinates":[-75.14310264,40.05701649],"type":"Point"}
        console.log("coordinates="  + JSON.stringify(coordinates));

        const possibly_sensitive = context.possibly_sensitive; // false,
        const truncated = context.truncated ; // false,
        const source = context.source; //: '<a href="https://peing.net" rel="nofollow">Peing</a>',
        const place = context.place || "";// : null,
        const contributors = context.contributors || ""; //: null,
        const is_quote_status = context.is_quote_status; //: false,
        const lang = context.lang; //'ja'
        
        return new TweetStatus(
            searchHistoryKey, 
            q, 
            id_str, 
            text,
            retweet_count,
            favorite_count,
            favorited,
            retweeted,
            created_at,
            user.followers_count,
            user.friends_count,
            user.favourites_count,
            user.statuses_count,
            // workaround for Data too long for column 'user' at row 1 
            "", // JSON.stringify(user),
            // workaround for Data too long for column 'entities' at row 1 
            "", // JSON.stringify(entities),
            JSON.stringify(metadata),
            JSON.stringify(geo),
            possibly_sensitive,
            truncated,
            source,
            in_reply_to_status_id_str,
            in_reply_to_user_id_str,
            in_reply_to_screen_name,
            JSON.stringify(coordinates),
            place,
            contributors,
            is_quote_status,
            lang
        );
    }
}
