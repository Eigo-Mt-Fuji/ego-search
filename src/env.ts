export default class Env {
    get egoSearchResultS3() {
        return {
            bucketName: this.getEnv("EGO_SEARCH_RESULT_BUCKET"),
        };
    }
    get egoSearchContext() {
        return {
            userName: this.getEnv("EGO_SEARCH_USER_NAME"),
            channelId: this.getEnv("EGO_SEARCH_CHANNEL_ID"),
            q: this.getEnv("EGO_SEARCH_KEYWORD"),
        };
    }
    get twitterCredential() {
        return {
            consumerKey: this.getEnv("TWITTER_CONSUMER_KEY"),
            consumerSecret: this.getEnv("TWITTER_CONSUMER_SECRET"),
            accessTokenKey: this.getEnv("TWITTER_ACCESS_TOKEN_KEY"),
            accessTokenSecret: this.getEnv("TWITTER_ACCESS_TOKEN_SECRET"),
        };
    }
    get youtubeCredential() {
        return {
            apiKey: this.getEnv("YOUTUBE_API_KEY"),
        };
    }

    protected getEnv(key: string): string {
        const val = process.env[key];
        if (!val) {
            throw new Error(`enviroment var: ${key} is not defined.`);
        }
        return val;
    }

}
