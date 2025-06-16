import { User } from "./user";
import { Media } from "./media";

export interface WatchProgress {
    id: number;
    user: User;
    media: Media;
    progress: number;
    updated_at: Date;
}

export interface InsertableWatchProgress {
    user_id: number;
    tmdb_id: number;
    progress: number;
    updated_at?: Date;
}
