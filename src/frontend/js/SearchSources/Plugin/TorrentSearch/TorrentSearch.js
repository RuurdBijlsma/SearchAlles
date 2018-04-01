class TorrentSearch extends SearchSource {
    constructor(windowHider) {
        super(windowHider);

        this.config = new SearchSourceConfig({
            name: 'TorrentSearch',
            onlySpecificMatches: true,
            priority: 5,
            resultLimit: 20,
            showImmediately: false,
        });

        this.api = new RarbgApi();
        this.isInitialized = false;
        this.api.onToken = () => {
            this.isInitialized = true;
        }
    }

    matches(query) {
        return this.isInitialized;
    }

    async search(query) {
        let results = [];

        let list = await this.api.search(query);
        let highestSeason = -Infinity,
            highestEpisode = -Infinity;
        if (list && list[Symbol.iterator]) {
            for (let torrent of list) {
                let category;
                if (torrent.category.toLowerCase().includes('tv'))
                    category = 'television';
                if (torrent.category.toLowerCase().includes('movie'))
                    category = 'film';

                let size = this.api.bytesToSize(torrent.size),
                    HD = torrent.title.includes('1080'),
                    episodeNumber, seasonNum, episodeNum,
                    date = torrent.pubdate.split(' ')[0].substr(5).split('-').reverse().join("/");

                if (torrent.episode_info === undefined || torrent.episode_info === null || torrent.episode_info.epnum === undefined || torrent.episode_info.seasonnum === undefined) {
                    let match = torrent.title.match(/s[0-9][0-9]e[0-9][0-9]/i);
                    if (match) {
                        episodeNumber = match[0];
                        let epInfo = episodeNumber.substr(1).split('E');
                        seasonNum = parseInt(epInfo[0]);
                        episodeNum = parseInt(epInfo[1]);
                    }
                } else {
                    seasonNum = parseInt(torrent.episode_info.seasonnum);
                    episodeNum = parseInt(torrent.episode_info.epnum);
                }
                if (seasonNum && episodeNum) {
                    episodeNumber = `S${(seasonNum < 10) ? ("0" + seasonNum) : seasonNum}E${(episodeNum < 10) ? ("0" + episodeNum) : episodeNum}`;
                    let actualEpisode = torrent.title.includes(episodeNumber);

                    if (seasonNum > highestSeason && actualEpisode) {
                        highestEpisode = -Infinity;
                        highestSeason = seasonNum;
                    }

                    if (seasonNum === highestSeason && episodeNum > highestEpisode && actualEpisode)
                        highestEpisode = episodeNum;
                }

                results.push({
                    episode: episodeNumber,
                    hd: HD,
                    category,
                    title: torrent.title.replace(/\./gi, ' '),
                    downloadUrl: torrent.download,
                    date,
                    seeders: torrent.seeders,
                    sizeString: size
                });
            }
        } else {
            return [];
        }
        let latestEpisode = `S${(highestSeason < 10) ? ("0" + highestSeason) : highestSeason}E${(highestEpisode < 10) ? ("0" + highestEpisode) : highestEpisode}`;

        return results.sort((a, b) => {
            if (a.episode !== b.episode) {
                if (a.episode === latestEpisode) {
                    return -1;
                } else if (b.episode === latestEpisode) {
                    return 1;
                }
            } else if (a.episode === latestEpisode) {
                return b.hd - a.hd;
            }

            return 0;
        });
    }

    async getResults(query) {
        let torrents = await this.search(query);
        console.log({torrents});
        return torrents.map(torrent => new SearchResult({
                iconUrl: torrent,
                title: torrent,
                getContent: () => `
                    <h1>${torrent}</h1>
                    <p>${torrent}</p>
                `,
                activate: () => {
                    alert('active');
                }
            })
        );
    }
}