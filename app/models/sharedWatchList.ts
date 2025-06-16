import { User } from "./user";
import { Media } from "./media";

export interface SharedWatchList {
    id: number;
    name: string;
    users: User[];
    medias: Media[];
    created_at: Date;
}

export interface InsertableSharedWatchList {
    name: string;
    user_ids: number[];
    media_ids: number[];
    created_at?: Date;
}
