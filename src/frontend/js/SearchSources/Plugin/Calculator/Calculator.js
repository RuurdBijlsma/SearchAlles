const Convert = require('ansi-to-html');

class Calculator extends SearchSource {
    constructor(windowHider) {
        super(windowHider);

        this.config = new SearchSourceConfig({
            name: 'Calculator',
            onlySpecificMatches: false,
            priority: 6,
            resultLimit: 1,
            showImmediately: true,
        });

        this.convert = new Convert();
        this.environment = Insect.initialEnvironment;
    }

    calculate(query) {
        let plain = Insect.repl(Insect.fmtPlain)(this.environment)(query);
        this.environment = plain.newEnv;
        if (plain.msgType === 'error')
            return false;

        let console = Insect.repl(Insect.fmtConsole)(this.environment)(query);
        let result = {plain: plain.msg, console: console.msg};

        return result;
    }

    async getResults(query) {
        let result = this.calculate(query);
        console.log(result);

        if (!result || result.plain === query || result.plain === '1 ' + query)
            return [];

        let htmlAnswer = this.convert.toHtml(result.console);
        let plainAnswer = ' = ' + result.plain;

        return [new SearchResult({
            iconUrl: 'js/SearchSources/Plugin/Calculator/icon.png',
            title: plainAnswer,
            getContent: () => `
                    <h1>${htmlAnswer}</h1>
                `,
        })];
    }
}