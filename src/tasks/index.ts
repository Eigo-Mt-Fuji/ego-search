import Env from "../env";
import EgoSearchService from "../services/ego_search_service";
import TwitterDriver from "../libs/twitter-driver";
import YoutubeDriver from "../libs/youtube-driver";
import {createConnection} from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import "reflect-metadata";
import SearchHistory from "../entities/search-history";
import TweetStatus from "../entities/tweet-status";
import YoutubeVideo from "../entities/youtube-video";

class Task {

    public async run() {
        const env = new Env();

        const service = new EgoSearchService(env, new TwitterDriver(env), new YoutubeDriver(env));
        await service.run(env.egoSearchContext.userName, env.egoSearchContext.channelId);
    }
}
const options: MysqlConnectionOptions = {
    "type": "mysql",
    "name":"default",
    "username": process.env.TYPEORM_USERNAME,
    "password": process.env.TYPEORM_PASSWORD,
    "database": process.env.TYPEORM_DATABASE,
    "host": process.env.TYPEORM_HOST,
    "port": parseInt(process.env.TYPEORM_PORT || "3306"),
    "entities": [
        SearchHistory,
        TweetStatus,
        YoutubeVideo,
    ],
};
createConnection(options).then(async(connection) => {
    const task = new Task();
    
    try {
        await task.run();
        console.log("完了");
    }catch(err) {
        
        console.log("エラー", err);
    }finally {
        await connection.close();
    }
    

}).catch((err)=>{ 
    console.log(err);
});
