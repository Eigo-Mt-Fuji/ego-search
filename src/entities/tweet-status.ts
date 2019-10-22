import { Entity, PrimaryColumn, Column } from "typeorm"

@Entity("tweet_status")
export default class TweetStatus {

    public constructor(
        search_history_key: string,
        q: string,
        tweet_id_str: string,
        tweet_text: string,
        retweet_count: number,
        favorite_count: number,
        favorited: boolean,
        retweeted: boolean,
        created_at: string,
        user_followers_count: number,
        user_friends_count: number,
        user_favourites_count: number,
        user_statuses_count: number,
        user: string,
        entities: string,
        metadata: string,
        geo: string,
        possibly_sensitive: string,
        truncated: boolean,
        source: string,
        in_reply_to_status_id_str: string,
        in_reply_to_user_id_str: string,
        in_reply_to_screen_name: string,
        coordinates: string,
        place: string,
        contributors: string,
        is_quote_status: boolean,
        lang: string
    ) {
        this.search_history_key = search_history_key;
        this.q = q;
        this.tweet_id_str = tweet_id_str;
        this.tweet_text = tweet_text;
        this.retweet_count = retweet_count;
        this.favorite_count = favorite_count;
        this.favorited = favorited;
        this.retweeted = retweeted;
        this.created_at =created_at;
        this.user_followers_count = user_followers_count;
        this.user_friends_count =user_friends_count;
        this.user_favourites_count = user_favourites_count;
        this.user_statuses_count = user_statuses_count;
        this.user = user;
        this.entities = entities;
        this.metadata = metadata;
        this.geo = geo;
        this.possibly_sensitive = possibly_sensitive;
        this.truncated = truncated;
        this.source = source;
        this.in_reply_to_status_id_str = in_reply_to_status_id_str;
        this.in_reply_to_user_id_str = in_reply_to_user_id_str;
        this.in_reply_to_screen_name = in_reply_to_screen_name;
        this.coordinates = coordinates;
        this.place = place;
        this.contributors = contributors;
        this.is_quote_status = is_quote_status;
        this.lang = lang;
    }
    @PrimaryColumn()
    search_history_key!: string;

    @PrimaryColumn()
    q!: string;

    @PrimaryColumn()
    tweet_id_str!: string;

    @Column()
    tweet_text!: string;
    @Column()
    retweet_count!: number;
    @Column()
    favorite_count!: number;
    @Column()
    favorited!: boolean;
    @Column()
    retweeted!: boolean;
    @Column()
    created_at!: string;
    @Column()
    user_followers_count!: number;
    @Column()
    user_friends_count!: number;
    @Column()
    user_favourites_count!: number;
    @Column()
    user_statuses_count!: number;
    @Column()
    user!: string;
    @Column()
    entities!: string;
    @Column()
    metadata!: string;
    @Column()
    geo!: string;
    @Column()
    possibly_sensitive!: string;
    @Column()
    truncated!: boolean;
    @Column()
    source!: string;
    @Column()
    in_reply_to_status_id_str!: string;
    @Column()
    in_reply_to_user_id_str!: string;
    @Column()
    in_reply_to_screen_name!: string;
    @Column()
    coordinates!: string;
    @Column()
    place!: string;
    @Column()
    contributors!: string;
    @Column()
    is_quote_status!: boolean;

    @Column()
    lang!: string;
}
