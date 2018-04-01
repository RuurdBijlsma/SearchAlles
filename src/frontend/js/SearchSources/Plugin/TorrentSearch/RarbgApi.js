class RarbgApi {
    constructor(url = 'https://torrentapi.org/pubapi_v2.php') {
        this.appId = 'ruurd-launcher';

        this.url = url;
        this.updateToken();
        this.refreshToken = setInterval(() => this.updateToken(), 14 * 60 * 1000);

        this.onToken = () => {
        };
    }

    bytesToSize(bytes) {
        let kilobytes = bytes / 1024;
        if (kilobytes < 1000)
            return Math.round(kilobytes * 100) / 100 + ' KB';
        let megabytes = kilobytes / 1024;
        if (megabytes < 1000)
            return Math.round(megabytes * 100) / 100 + ' MB';
        let gigabytes = megabytes / 1024;
        if (gigabytes < 1000)
            return Math.round(gigabytes * 100) / 100 + ' GB';
        let terabytes = gigabytes / 1024;
        if (terabytes < 1000)
            return Math.round(terabytes * 100) / 100 + ' TB';
    }

    async search(query) {
        let torrents = await this.get(this.url, {
            token: this.token,
            mode: 'search',
            search_string: query,
            limit: 20,
            ranked: 0,
            app_id: this.appId
        });
        return torrents.torrent_results;
    }

    get token() {
        return this._token || null;
    }

    async updateToken() {
        let api = this;
        let tokenData = await this.get(this.url, {
            get_token: 'get_token',
            app_id: this.appId
        });
        let firstToken = !api.token;
        api._token = tokenData.token;
        if (firstToken)
            api.onToken();
    }

    async get(url, data) {
        let link = url + '?';
        for (let prop in data)
            link += prop + `=${data[prop]}&`;
        //link = 'get.php?url=' + link.substr(0, link.length - 1);
        link += 'format=json_extended';

        let response = await fetch(link);
        let jsonResponse = await response.text();
        return JSON.parse(jsonResponse);
    }
}
