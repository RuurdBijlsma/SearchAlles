class Search {
    constructor(...searchSources) {
        this.sources = searchSources;
        this.doneTypingTimeout = -1;
        this.doneTypingDelay = 1000;
    }

    async getResults(query, showAllowed = false) {
        let realQuery = query;
        let isSpecificQuery = realQuery[0] === ':';
        let validSources;
        console.log({isSpecificQuery})
        if (isSpecificQuery) {
            let queryTokens = realQuery.split(' ');
            let sourceName = queryTokens[0].substr(1).toLowerCase();
            realQuery = queryTokens.slice(1).join(' ');
            validSources = this.sources
                .filter(source => source.config.name.toLowerCase().startsWith(sourceName))
                .filter(source => source.matches(realQuery))
                .sort((sourceA, sourceB) => sourceB.config.priority - sourceA.config.priority);
        } else {
            validSources = this.sources
                .filter(source => !source.config.onlySpecificMatches)
                .filter(source => source.matches(realQuery))
                .sort((sourceA, sourceB) => sourceB.config.priority - sourceA.config.priority);
        }


        let result = {};
        for (let source of validSources) {
            let sourceResults = await source.getResults(realQuery);
            result[source.config.name] = sourceResults.slice(0, source.config.resultLimit);
        }

        return result;
    }
}