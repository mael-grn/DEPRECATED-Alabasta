
export default class Media {
    constructor(id, title) {
        this.id = id
        this.title = title;
        this.currentProgress = 0;
        this.year = "";
        this.date = "";
        this.poster = "";
        this.backdrop = ""
        this.qualitiesLinks = [];
        this.genres = [];
        this.imdbId = "";
        this.language = "";
        this.overview = "";
        this.country = "";
        this.runtime = 0;
        this.status = "";
        this.vote = 0;
        this.voteCount = 0;
        this.popularity = 0;
        this.type = ""; //movie, tv, season or episode. Anime are considered as tv shows
        this.children = [];
        this.parentId = null;
        this.number = null; // le numero de saison ou d'episode
        this.currentNumber = null; // le numero de l'episode actuel
        this.lastAirDate = null;
    }
}
