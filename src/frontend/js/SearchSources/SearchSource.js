class SearchSource {
    get name() {
        return 'Default';
    }

    matches(query) {
        return true;
    }

    getResults(query) {
        return [
            new SearchResult({
                id: 1,
                iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                title: 'Default Result 1' + query,
                getContent: () => `
                    <h1>Default Result 1</h1>
                    <p>${query}</p>
                `
            }), new SearchResult({
                id: 2,
                iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                title: 'Default Result 2',
                getContent: () => `
                    <h1>Default Result 2</h1>
                    <p>${query}</p>
                `
            })
        ];
    }
}