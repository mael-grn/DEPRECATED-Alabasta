import MediaType from "@/app/enum/MediaTypeEnum";
import StreamLink from "@/app/models/StreamLink";

export default interface Media {
    title: string;
    type: MediaType
    year: number;
    posterUrl: string;
    backdropUrl: string;
    streamLinks: StreamLink[];
    genres: string[];
    imdbId: string;
    tmdbId: string;
    vo: string;
    overview: string;
    runtime: number;
    vote: number;
    voteCount: number;
}