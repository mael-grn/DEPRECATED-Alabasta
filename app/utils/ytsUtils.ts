import ServiceResponse from "@/app/models/ServiceResponse";
import StreamLink from "@/app/models/StreamLink";
import ErrorType from "@/app/enum/ErrorTypeEnum";
import Quality from "@/app/enum/QualityEnum";
import { JSDOM } from 'jsdom';
import TmdbService from "@/app/services/tmdbService";

export async function getMagnetLinks(tmdbId: string) :Promise<ServiceResponse<StreamLink[]>> {

    const mediaRes = await TmdbService.getMovieDetails(tmdbId, "en");
    if (!mediaRes.success) {
        return {
            success:false,
            error: mediaRes.error
        }
    }

    const newTitle = mediaRes.data!.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]+/g, "-");
    const firstTryRes = await fetch(`https://yts.rs/movie/${newTitle}-${mediaRes.data!.year}`)
    if (firstTryRes.status === 404) {
        return {
            success:false,
            error: ErrorType.MEDIA_NOT_FOUND
        }
    }

    if (firstTryRes.ok) {
        const data = await firstTryRes.text();
        const dom = new JSDOM(data);
        const document = dom.window.document;
        return searchMagnetLinksOnMoviePage(document);
    }

    return {
        success:false,
        error: ErrorType.SERVER_ERROR
    }
}

export async function searchMagnetLinksOnMoviePage(page: Document) : Promise<ServiceResponse<StreamLink[]>> {

    const links = page.querySelectorAll("a.download-torrent");

    if (links.length < 1) {
        return {
            success: false,
            error: ErrorType.MEDIA_NOT_FOUND,
        }
    }

    const resultLinks: StreamLink[] = []

    for (const link of links) {
        if (link.getAttribute("href")?.startsWith("magnet")) {
            let quality: Quality | null = null
            if (link.textContent?.toString().includes("720")) quality = Quality.SD
            else if (link.textContent?.toString().includes("1080")) quality = Quality.HD
            else if (link.textContent?.toString().includes("2160")) quality = Quality.K4
            else quality = Quality.UNKNOWN

            resultLinks.push({
                quality: quality,
                magnetLink: link.getAttribute("href")!
            })
        }
    }

    return {
        success: true,
        data: resultLinks
    }
}