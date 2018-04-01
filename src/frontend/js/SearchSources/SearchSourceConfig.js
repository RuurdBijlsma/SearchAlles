class SearchSourceConfig {
    constructor({name, onlySpecificMatches, priority, resultLimit, showImmediately}) {
        this.name = name;
        this.onlySpecificMatches = onlySpecificMatches;
        this.priority = priority;
        this.resultLimit = resultLimit;
        this.showImmediately = showImmediately;
    }
}