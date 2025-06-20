import { Media } from "./media";

export interface TmdbMagnetLink {
    id: number;
    media: Media;
    magnet_link: string;
    quality: string;
    language: string;
    source: string;
    created_at: Date;
}

export interface InsertableTmdbMagnetLink {
    tmdb_id: string;
    magnet_link: string;
    quality: string;
    language: string;
    source: string;
}
