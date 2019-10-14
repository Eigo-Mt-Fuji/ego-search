import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";

@Entity()
export default class SearchHistory {

    public constructor(key: string, channelId: string, now: Date) {
        this.key = key;
        this.channel_id = channelId;
        this.created_at = now;
    }
    @PrimaryColumn()
    public key!: string;

    @Column()
    public channel_id!: string;

    @Column()
    public created_at!: Date;
}