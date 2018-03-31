class Search {
    constructor(...searchSources) {
        this.sources = searchSources;
    }

    getResults(query) {
        let isSpecificQuery = query[0] === ':';
        let validSources;
        if (isSpecificQuery) {
            let queryTokens = query.split(' ');
            let sourceName = queryTokens[0].substr(1).toLowerCase();
            query = queryTokens.slice(1).join(' ');
            validSources = this.sources
                .filter(source => source.config.name.toLowerCase().startsWith(sourceName))
                .filter(source => source.matches(query))
                .sort((sourceA, sourceB) => sourceB.config.priority - sourceA.config.priority);
        } else {
            validSources = this.sources
                .filter(source => !source.config.onlySpecificMatches)
                .filter(source => source.matches(query))
                .sort((sourceA, sourceB) => sourceB.config.priority - sourceA.config.priority);
        }

        let result = {};
        for (let source of validSources) {
            result[source.config.name] = source.getResults(query);
        }
        return result;
    }
}