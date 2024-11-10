import omdbSearch from "@/app/api/media/omdb/omdbSearch";

export default async function omdbUpdateMediaData(media) {
    const newMedia = await omdbSearch(media.title);
    if (!newMedia) return null;
    newMedia.qualitiesLinks = media.qualitiesLinks;
    newMedia.pageUrl = media.pageUrl;
    newMedia.provider = media.provider;
    return newMedia
}