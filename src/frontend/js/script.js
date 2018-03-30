document.addEventListener('DOMContentLoaded', init, false);
const {remote} = require('electron');

async function init() {
    console.log("HEYHEY");


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
}