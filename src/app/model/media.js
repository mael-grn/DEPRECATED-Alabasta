
export default class Media {
    constructor(name, provider, pageUrl) {
        this.id = name.replace(/ /g, "-") + "-" + provider;
        this.name = name;
        this.year = name.match(/\d{4}/) ? name.match(/\d{4}/)[0] : null;
        this.provider = provider
        this.pageUrl = pageUrl;
        this.imageUrl = "";
        this.qualitiesLinks = [];
    }
}
