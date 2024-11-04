
export default class Media {
    constructor(title, provider, pageUrl) {
        this.id = title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "-") + "-" + provider;
        this.title = title;
        this.year = title.match(/\d{4}/) ? title.match(/\d{4}/)[0] : null;
        this.provider = provider
        this.pageUrl = pageUrl;
        this.poster = "";
        this.qualitiesLinks = [];
        this.runtime = "";
        this.genre = "";
        this.director = "";
        this.writer = "";
        this.actors = "";
        this.plot = "";
        this.awards = "";
        this.country = "";
        this.ratings = [];
        this.type = "";
        this.imdbID = "";
        this.imdbRating = "";
        this.imdbVotes = "";
    }
}
