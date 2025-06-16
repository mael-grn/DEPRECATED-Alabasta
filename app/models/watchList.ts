import { User } from "./user";
import { Media } from "./media";

export interface WatchList {
    id: number;
    user: User;
    medias: Media[];
    created_at: Date;
}

export interface InsertableWatchList {
    user_id: number;
    media_ids: number[];
    created_at?: Date;
}
