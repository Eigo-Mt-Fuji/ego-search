export default class Env {
    get egoSearchResultS3() {
        return {
            bucketName: this.getEnv("EGO_SEARCH_RESULT_BUCKET"),
        };
    }
    get twitterCredential() {
        return {
            apiKey: this.getEnv("EGO_SEARCH_TWITTER_API_KEY"),
        };
    }
    get youtubeCredential() {
        return {
            apiKey: this.getEnv("EGO_SEARCH_YOUTUBE_API_KEY"),
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
