export default async function openSubtitleSearch(imdbId) {

    const res = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdbId}`, {
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
    const subsLst = data.data.filter(item => item.attributes.language === "fr");

    const filteredSubsLst = subsLst.reduce((max, item) => {
        return (item.attributes.download_count > max.attributes.download_count) ? item : max;
    }, subsLst[0]);

    return filteredSubsLst.attributes.files[0].file_id;
}