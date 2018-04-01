const ws = require('windows-shortcuts');
const path = require('path');
const iconExtractor = require('icon-extractor');
const {exec} = require('child_process');


class AppSearch extends SearchSource {
    constructor(windowHider) {
        super(windowHider);

        this.config = new SearchSourceConfig({
            name: 'Applications',
            onlySpecificMatches: false,
            priority: 5,
            resultLimit: 5,
            showImmediately: true,
        });

        this.windowsAppDirectories = [
            process.env.APPDATA + '/Microsoft/Windows/Start Menu/Programs/',
            process.env.ProgramData + '/Microsoft/Windows/Start Menu/Programs/'
        ];

        this.windowsAppExtention = '.lnk';
        iconExtractor.emitter.setMaxListeners(10000);

        this.isInitialized = false;
        this.initializeAppList().then(() => this.isInitialized = true);
    }

    async initializeAppList() {
        console.log('Loading apps');
        let files = [];
        for (let dir of this.windowsAppDirectories) {
            files = files.concat(await utils.allFilesInDir(dir));
        }
        let shortcutPaths = files.filter(file => file.endsWith(this.windowsAppExtention));

        this.appList = [];
        for (let shortcutPath of shortcutPaths) {
            this.getShortcutInfo(shortcutPath).then(info => {
                if (info) {
                    info.name = path.basename(shortcutPath).slice(0, -this.windowsAppExtention.length);

                    this.appList.push(info);
                }
            });
        }
        console.log('Done loading apps');
    }

    async getExeIcon(path) {
        return new Promise(resolve => {
            let id = Math.random().toString();
            let eventFunction = iconData => {
                if (iconData.Context === id) {
                    resolve(iconData);

                    iconExtractor.emitter.removeListener('icon', eventFunction);
                }
            };
            iconExtractor.emitter.on('icon', eventFunction);
            iconExtractor.getIcon(id, path);
        });
    }

    fixPath(path) {
        path = path.replace(/%windir%/gi, process.env.windir);
        path = path.replace(/%homedrive%/gi, process.env.HOMEDRIVE);
        path = path.replace(/%homepath%/gi, process.env.HOMEPATH);
        path = path.replace(/%appdata%/gi, process.env.APPDATA);
        path = path.replace(/%systemroot%/gi, process.env.SystemRoot);
        path = path.replace(/%programfiles%/gi, process.env.ProgramFiles);

        return path;
    }

    async getShortcutInfo(path) {
        return new Promise((resolve) => {
            ws.query(path, async (err, result) => {
                if (err) {
                    resolve(false);
                } else {
                    result.oldIcon = result.icon;
                    result.shortcutPath = path;
                    result.icon = await this.getExeIcon(result.expanded.icon.length ? result.expanded.icon : result.shortcutPath);
                    resolve(result);
                }
            });
        })
    }

    matches(query) {
        return this.isInitialized;
    }

    set appList(value) {
        this._appList = value;
    }

    get appList() {
        return this._appList;
    }

    getMatchingApps(query) {
        query = query.toLowerCase();
        return this.appList
            .filter(app => app.name.toLowerCase().includes(query))
            .sort((a, b) => a.name.indexOf(query) - b.name.indexOf(query));
        return this.appList.filter(app => {
            let appWords = app.name.toLowerCase().split(' ');
            for (let appWord of appWords)
                for (let queryWord of query)
                    if (appWord.startsWith(queryWord))
                        return true;
            return false;
        });
    }

    async getResults(query) {
        let apps = this.getMatchingApps(query);
        console.log(apps);
        return apps.map(app => new SearchResult({
                iconUrl: 'data:image/png;base64, ' + app.icon.Base64ImageData,
                title: app.name,
                getContent: () => `
                    <img src="data:image/png;base64,  ${app.icon.Base64ImageData}">
                    <h1>${app.name}</h1>
                    <p>${app.desc}</p>
                `,
                activate: () => {
                    console.log(app);
                    let command = `"${app.expanded.target}" ${app.args}`;
                    this.hideApp();
                    exec(command);
                }
            })
        );
    }
}