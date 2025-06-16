import { User } from "./user";
import { Media } from "./media";

export interface Opinion {
    id: number;
    user: User;
    media: Media;
    grade: number;
    comment: string;
    created_at: Date;
}

export interface InsertableOpinion {
    user_id: number;
    tmdb_id: number;
    rating: number;
    comment: string;
    created_at?: Date;
}
