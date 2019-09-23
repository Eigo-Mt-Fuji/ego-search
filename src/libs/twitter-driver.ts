import * as Twitter from "twitter";

export default class TwitterDriver {
    private client: Twitter;    
    /**
     * @param bucketName 操作対象のバケット名
     */
    public constructor(private env: any) {
        
        this.client = new Twitter(
            {
                consumer_key: env.twitterCredential.consumerKey,
                consumer_secret: env.twitterCredential.consumerSecret,
                access_token_key: env.twitterCredential.accessTokenKey,
                access_token_secret: env.twitterCredential.accessTokenSecret,
            }
        )
    }
    public async searchTweet(q:string) {
        const params: Twitter.RequestParams = {
            q
        };
        return await this.client.get('search/tweets', params);
    }

}