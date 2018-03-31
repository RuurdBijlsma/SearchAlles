class SearchSource {
    constructor() {
        this.config = new SearchSourceConfig({
            name: 'Default',
            onlySpecificMatches: false,
            priority: 0
        });
    }

    matches(query) {
        return true;
    }

    getResults(query) {
        return [
            new SearchResult({
                iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                title: 'Default Result 1' + query,
                getContent: () => `
                    <h1>Default Result 1</h1>
                    <p>${query}</p>
                `,
                activate: () => {
                    alert('Activated default 1, query:' + query);
                }
            }), new SearchResult({
                iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                title: 'Default Result 2',
                getContent: () => `
                    <h1>Default Result 2</h1>
                    <p>${query}</p>
                `,
                activate: () => {
                    alert('Activated default 2, query:' + query);
                }
            })
        ];
    }
}