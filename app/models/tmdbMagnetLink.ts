import { Media } from "./media";

export interface TmdbMagnetLink {
    id: number;
    media: Media;
    magnet_link: string;
    quality: string;
    language: string;
    created_at: Date;
}

export interface InsertableTmdbMagnetLink {
    tmdb_id: number;
    magnet_link: string;
    quality: string;
    language: string;
    created_at?: Date;
}
