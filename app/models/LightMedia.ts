import MediaType from "@/app/enum/MediaTypeEnum";

export default interface LightMedia {
    title: string,
    year: number,
    posterUrl: string,
    type: MediaType,
    tmdbId: string,
}