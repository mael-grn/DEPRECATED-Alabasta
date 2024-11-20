export default async function openSubtitleSearch(imdbId) {

    const res = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdbId}&languages=fr`, {
        method: 'GET',
        headers: {
            'Api-Key': process.env.OPEN_SUBS_API_KEY,
            'User-Agent': 'Alabasta v0.1'
        }
    })

    if (!res.ok) {
        console.error("impossible to fetch opensubtitle : " + res.status)
        return null;
    }

    const data = await res.json();


    // on retourne les file_id par ordre de téléchargement
    return data.data
        .sort((a, b) => b.attributes.download_count - a.attributes.download_count)
        .map((item, index) => ({name: "francais " + (index+1), id: item.attributes.files[0].file_id}));
}