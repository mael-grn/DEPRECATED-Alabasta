import MediaType from "@/app/enums/mediaTypeEnum";

export interface Media {
    title: string;
    type: MediaType
    year: number;
    posterUrl: string;
    backdropUrl: string;
    genres: string[];
    imdbId: string;
    tmdbId: string;
    vo: string;
    overview: string;
    runtime: number;
    vote: number;
    voteCount: number;
}