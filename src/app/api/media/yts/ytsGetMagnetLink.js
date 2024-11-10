/**
 * Fetch data from a yts movie's page url to get torrent magnetLinks
 * @param pageUrl the movie's page url
 * @returns {Promise<*[]>} a lit of {quality, magnetLink}
 */
export default async function ytsGetMagnetLink(pageUrl) {
    const response = await fetch(pageUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const html = await response.text();

    // Regex pour récupérer tous les liens magnet et leur qualité
    const magnetLinks = [];
    const regex = /<a href="(magnet:\?xt=urn:btih:[^"]+)"[^>]*>\s*<img src="images\/magnet\.svg"[^>]*>\s*<!-- -->\s*([^<]+)<\/a>/g;

    let match;
    while ((match = regex.exec(html)) !== null) {
        const magnetLink = match[1]; // Lien magnet
        const quality = match[2].trim(); // Qualité (ex. 720p, 1080p)
        magnetLinks.push({ provider: "yts", quality, magnetLink });
    }

    return magnetLinks;
}