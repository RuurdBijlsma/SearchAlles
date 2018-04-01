class SearchSourceConfig {
    constructor({name, onlySpecificMatches, priority, resultLimit}) {
        this.name = name;
        this.onlySpecificMatches = onlySpecificMatches;
        this.priority = priority;
        this.resultLimit = resultLimit;
    }
}