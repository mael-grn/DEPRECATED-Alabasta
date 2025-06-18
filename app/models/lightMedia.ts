import MediaType from "@/app/enums/mediaTypeEnum";

export default interface LightMedia {
    title: string,
    year: number,
    posterUrl: string,
    type: MediaType,
    tmdbId: string,
}