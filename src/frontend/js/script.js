// Todo
// Insect integreren
// Abstraheren
// Plugin support
// Cachen
// Prioriteiten aan searchsources geven
// Top hit bedenken

document.addEventListener('DOMContentLoaded', init, false);
const {remote} = require('electron');
const globalShortcut = remote.globalShortcut;
const mainWindow = remote.getCurrentWindow();

async function init() {
    windowHider = new WindowHider(mainWindow, document.body);
    searcher = new Search(
        new SearchSource()
    );

    registerShortcuts();
}

function search(query) {
    if (query.length > 0)
        windowHider.expand();
    else
        windowHider.retract();

    currentResults = searcher.getResults(query);
    console.log(currentResults);

    let isFirstResult = true;
    let firstResult;

    let html = '';
    let resultListElement = document.body.querySelector('.result-list');
    for (let resultName in currentResults) {
        let resultList = currentResults[resultName];
        if (resultList.length === 0)
            continue;

        html += `
            <div class="result-source-name">${resultName}</div>
        `;

        for (let result of resultList) {
            if (isFirstResult) {
                isFirstResult = false;
                firstResult = {resultName, result};
            }

            html += `
                <div class="result-item" id="${resultName}${result.id}" onmousedown="selectResult('${resultName}','${result.id}')">
                    <div class="result-item-icon" style="background-image: url('${result.iconUrl}')"></div>
                    <span>${result.title}</span>
                </div>
            `;
        }
    }
    resultListElement.innerHTML = html;

    selectResult(firstResult.resultName, firstResult.result.id.toString());
}

function selectResult(resultName, id) {
    for (let resultElement of document.querySelectorAll('.result-item[active]')) {
        resultElement.removeAttribute('active');
    }

    let selectedResult = currentResults[resultName].find(r => r.id.toString() === id);
    let element = document.getElementById(resultName + id.toString());
    element.setAttribute('active', '');

    document.querySelector('.result-content').innerHTML = selectedResult.getContent();
}

function registerShortcuts() {
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case "F12":
                remote.getCurrentWindow().webContents.toggleDevTools();
                break;
            case "F5":
                location.reload();
                break;
        }
    });

    const success = globalShortcut.register('CommandOrControl+Space', () => {
        windowHider.toggle(mainWindow);
    });

    if (!success)
        console.log('Failed to register key');

    console.log('Key register success: ', globalShortcut.isRegistered('CommandOrControl+Space'));
}