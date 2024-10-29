
export default class Movie {
    constructor(imageUrl, name, pageUrl) {
        this.imageUrl = imageUrl;
        this.name = name;
        this.id = name.replace(/ /g, "-").replace(/\?/g, "");
        this.pageUrl = pageUrl;
        this.qualities = [];
    }
}
