/**
 * class that represents a movie object from yts website
 */
export default class ytsMovie {
    constructor(title, year, pageUrl, qualitiesLinks) {
        this.title = title;
        this.year = year;
        this.pageUrl = pageUrl;
        this.qualitiesLinks = qualitiesLinks;
    }
}
