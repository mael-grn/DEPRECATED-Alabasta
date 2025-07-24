import {InsertableTmdbMagnetLink} from "@/app/models/tmdbMagnetLink";
import {Media} from "@/app/models/media";
import axios, {AxiosError} from "axios";
import { JSDOM } from "jsdom";

const ENDPOINTS = [
    "https://tpirbay.site/",
    "https://tpirbay.top/",
    "https://tpirbay.xyz/",
"https://piratebayproxy.live/"
];

export async function getPirateBayMagnetLinks(media: Media): Promise<InsertableTmdbMagnetLink[]> {
    const newTitle = media.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]+/g, "-");

    try {
        const fetchedMoviePage = await axios.get(`https://yts.rs/movie/${newTitle}-${media.year}`)

        const moviePageDom = new JSDOM(fetchedMoviePage.data);
        const moviePage = moviePageDom.window.document;

        const links = moviePage.querySelectorAll("a.download-torrent");

        if (links.length <= 0) {
            return [];
        }

        const resultLinks: InsertableTmdbMagnetLink[] = []

        for (const link of links) {
            if (link.getAttribute("href")?.startsWith("magnet")) {
                let quality: string | null = null
                if (link.textContent?.toString().includes("720")) quality = '720p'
                else if (link.textContent?.toString().includes("1080")) quality = '1080p'
                else if (link.textContent?.toString().includes("2160")) quality = '4k'
                else quality = 'Inconnu'

                resultLinks.push({
                    tmdb_id: media.tmdbId,
                    quality: quality,
                    language: media.vo, //les films sur yts sont toujours en VO
                    source: 'YTS',
                    magnet_link: link.getAttribute("href")!
                })
            }
        }

        return resultLinks;

    } catch (e) {
        throw (e as AxiosError).status || -1
    }

}