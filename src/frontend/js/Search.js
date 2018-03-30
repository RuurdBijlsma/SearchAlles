class Search {
    constructor(...searchSources) {
        this.sources = searchSources;
    }

    getResults(query) {
        let validSources = this.sources.filter(source => source.matches(query));
        let result = {};
        for (let source of validSources) {
            result[source.name] = source.getResults(query);
        }
        return result;
    }
}