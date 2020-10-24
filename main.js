'use strict';

const { app, BrowserWindow, globalShortcut, Menu, MenuItem, Tray } = require("electron");
const isMac = process.platform === 'darwin';

let tray = null;

function Init() {
    // Create Window
    const win = new BrowserWindow({
        icon: `${__dirname}/images/plex.ico`,
        frame: false,
        transparent: false,
        width: 1280,
        height: 720,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            webviewTag: true,
        },
    });
    win.loadFile("index.html");

    // Create Tray Menu
    tray = new Tray(`${__dirname}/images/plex.ico`);

    const contextMenu = Menu.buildFromTemplate([
        { label: "Item1", type: "radio" },
        { type: 'separator' },
        { role: "quit", accelerator: "CmdOrCtrl+Q" }
    ]);

    tray.setToolTip("PlexWrap");
    tray.setContextMenu(contextMenu);

    tray.on("click", function() {
        win.show();
    });

    // Set Shortcuts
    globalShortcut.register("CmdOrCtrl+Q",  () => {
        app.quit();
    });
}

app.whenReady().then(Init);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        tray.destroy();
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        Init();
    }
});
