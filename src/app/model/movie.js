
export default class Movie {
    constructor(imageUrl, name, pageUrl) {
        this.imageUrl = imageUrl;
        this.name = name.replace(/\(\d{4}\)/, "").trim();
        this.id = name.replace(/ /g, "-").replace(/\?/g, "");
        this.year = name.match(/\d{4}/) ? name.match(/\d{4}/)[0] : null;
        this.pageUrl = pageUrl;
        this.qualities = [];
    }
}
