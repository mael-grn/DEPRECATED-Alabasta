export default async function(movieId) {
    const response = await fetch(movieId, {
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
        magnetLinks.push({ quality, magnetLink });
    }

    return magnetLinks;
}