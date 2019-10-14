import { PrimaryColumn, Column } from "typeorm"

export default class YoutubeVideo {

    public constructor(search_history_key: string,video_id: string,snippet_channel_id: string,snippet_title: string,snippet_description: string,snippet_published_at: string,statistics_view_count: number,
        statistics_like_count: number,
        statistics_dislike_count: number,
        statistics_favorite_count: number,
        statistics_comment_count: number,
        context: string
    ) {
        this.search_history_key = search_history_key;
        this.video_id = video_id;
        this.snippet_channel_id = snippet_channel_id;
        this.snippet_title = snippet_title;
        this.snippet_description = snippet_description;
        this.snippet_published_at = snippet_published_at;
        this.statistics_view_count = statistics_view_count;
        this.statistics_like_count = statistics_like_count;
        this.statistics_dislike_count = statistics_dislike_count;
        this.statistics_favorite_count = statistics_favorite_count;
        this.statistics_comment_count = statistics_comment_count;
        this.context = context;
    }
    @PrimaryColumn()
    search_history_key!: string;

    @PrimaryColumn()
    video_id!: string;

    @Column()
    snippet_channel_id!: string;

    @Column()
    snippet_title!: string;

    @Column()
    snippet_description!: string;

    @Column()
    snippet_published_at!: string; 

    @Column()
    statistics_view_count!: number;

    @Column()
    statistics_like_count!: number;

    @Column()
    statistics_dislike_count!: number;

    @Column()
    statistics_favorite_count!: number;

    @Column()
    statistics_comment_count!: number;

    @Column()
    context!: string;
}