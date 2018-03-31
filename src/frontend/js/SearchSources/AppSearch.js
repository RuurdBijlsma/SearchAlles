class AppSearch {
    constructor() {
        this.config = new SearchSourceConfig({
            name: 'Applications',
            onlySpecificMatches: false,
            priority: 5
        });

        this.initializeAppList();
    }

    initializeAppList() {
        this.appList = [
            'hoi', 'ik', 'ben', 'ruurd', 'doei'
        ];
    }

    matches(query) {
        return true;
    }

    set appList(value) {
        this._appList = value;
    }

    get appList() {
        return this._appList;
    }

    getMatchingApps(query) {
        return this.appList.filter(app => app.includes(query));
    }

    getResults(query) {
        let apps = this.getMatchingApps(query);
        return apps.map(app => new SearchResult({
                iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                title: app,
                getContent: () => `
                    <h1>${app}</h1>
                    <p>${query}</p>
                `,
                activate: () => {
                    alert('open app:' + app);
                }
            })
        );
    }
}