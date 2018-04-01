class SearchResult {
    constructor({iconUrl, title, getContent, activate = {}}) {
        this.iconUrl = iconUrl;
        this.title = title;
        this.getContent = getContent;
        this.activate = activate;

        this.index = -1;
    }
}