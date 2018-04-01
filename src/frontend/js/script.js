// Todo
// Insect integreren
// Abstraheren
// Plugin support
// Cachen
// Top hit bedenken
// Log framework maken
// Settings.json met elke source options erin
// Bij appsearch met afortingen zoeken bijvoorbeeld as naar android studio
// App search cahcen en bijhouden hoevaak een app gekozen is
// too many requests voorkomen op een of andere manier, misschien detecteren wanneer typen klaar is

document.addEventListener('DOMContentLoaded', init, false);
const utils = require('../backend/utils.js');
const {remote} = require('electron');
const globalShortcut = remote.globalShortcut;
const mainWindow = remote.getCurrentWindow();

async function init() {
    windowHider = new WindowHider(mainWindow, document.body);
    searcher = new Search(
        new Calculator(windowHider),
        new AppSearch(windowHider),
        new TorrentSearch(windowHider),
    );

    registerShortcuts();
}

async function search(query) {
    if (query.length === 0) {
        windowHider.retract();
        return;
    }

    currentResults = await searcher.getResults(query);
    currentIndex = 0;

    let html = '';
    let resultListElement = document.body.querySelector('.result-list');
    let index = 0;
    for (let resultName in currentResults) {
        let resultList = currentResults[resultName];
        if (resultList.length === 0)
            continue;

        html += `
            <div class="result-source-name">${resultName}</div>
        `;

        for (let result of resultList) {
            result.index = index++;

            html += `
                <div class="result-item" 
                id="result${result.index}" 
                onmousedown="selectResult(${result.index})"
                ondblclick="activateResult(${result.index})">
                    <div class="result-item-icon" style="background-image: url('${result.iconUrl}')"></div>
                    <span>${result.title}</span>
                </div>
            `;
        }
    }
    resultListElement.innerHTML = html;
    maxIndex = index;

    if (index > 0) {
        windowHider.expand();
        selectResult(currentIndex);
    } else {
        windowHider.retract();
    }
}

function getResultByIndex(index) {
    for (let resultName in currentResults) {
        for (let result of currentResults[resultName]) {
            if (result.index === index)
                return result;
        }
    }
    return null;
}

function activateResult(index) {
    let selectedResult = getResultByIndex(index);
    console.log(selectedResult);
    selectedResult.activate();
}

function selectResult(index) {
    currentIndex = index;
    for (let resultElement of document.querySelectorAll('.result-item[active]')) {
        resultElement.removeAttribute('active');
    }

    let selectedResult = getResultByIndex(index);
    let element = document.getElementById('result' + index);
    element.setAttribute('active', '');

    document.querySelector('.result-content').innerHTML = selectedResult.getContent();
}

function selectUp() {
    if (typeof currentIndex === 'undefined') return;

    if (currentIndex > 0)
        currentIndex--;
    selectResult(currentIndex);
}

function selectDown() {
    if (typeof currentIndex === 'undefined') return;

    if (currentIndex + 1 < maxIndex)
        currentIndex++;
    selectResult(currentIndex);
}

function registerShortcuts() {
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case "ArrowUp":
                selectUp();
                break;
            case "ArrowDown":
                selectDown();
                break;
            case "Enter":
                getResultByIndex(currentIndex).activate();
                break;
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