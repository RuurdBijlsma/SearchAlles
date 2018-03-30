document.addEventListener('DOMContentLoaded', init, false);
const {remote} = require('electron');
const globalShortcut = remote.globalShortcut;
const mainWindow = remote.getCurrentWindow();

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

    const activationKey = globalShortcut.register('CommandOrControl+Space', () => {
        toggleWindow(mainWindow);
    });

    if (!activationKey)
        console.log('failed');

    console.log(globalShortcut.isRegistered('CommandOrControl+Space'));
}

function toggleWindow(win) {
    if (win.isVisible()) {
        win.hide();
    } else {
        win.show();
    }
}