create table typeorm_metadata (
  `type` varchar(255) NOT NULL,
  `database` varchar(255) DEFAULT NULL,
  `schema` varchar(255) DEFAULT NULL,
  `table` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `value` text
) ENGINE=InnoDB;

create table search_history (
  `key` varchar(255) primary key, 
  channel_id varchar(255), 
  created_at datetime
);

create table youtube_videos(
    search_history_key varchar(255),
    video_id varchar(255),
    snippet_channel_id varchar(255),
    snippet_title text,
    snippet_description text,
    snippet_published_at varchar(255),
    statistics_view_count bigint,
    statistics_like_count bigint,
    statistics_dislike_count bigint,
    statistics_favorite_count bigint,
    statistics_comment_count bigint,
    context text,
    primary key (search_history_key, video_id)
);

create table tweet_status(
    search_history_key varchar(255),
    q varchar(255),
    tweet_id_str varchar(255),
    tweet_text varchar(255),
    retweet_count bigint,
    favorite_count bigint,
    favorited boolean,
    retweeted boolean,
    created_at varchar(255),
    user_followers_count bigint,
    user_friends_count bigint,
    user_favourites_count bigint,
    user_statuses_count bigint,
    user varchar(255),
    entities varchar(255),
    metadata varchar(255),
    geo varchar(255),
    possibly_sensitive varchar(255),
    truncated boolean,
    source varchar(255),
    in_reply_to_status_id_str varchar(255),
    in_reply_to_user_id_str varchar(255),
    in_reply_to_screen_name varchar(255),
    coordinates varchar(255),
    place varchar(255),
    contributors varchar(255),
    is_quote_status boolean,
    lang varchar(255),

    PRIMARY KEY(search_history_key, q, tweet_id_str)
);