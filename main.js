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
    tray = new Tray(`${__dirname}/images/plex.png`);

    const contextMenu = new Menu();
    contextMenu.append(new MenuItem({
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: function() {
            win.reload();
        } 
    }));
    contextMenu.append(new MenuItem({ type: "separator" }));
    contextMenu.append(new MenuItem({
        role: "quit",
        accelerator: "CmdOrCtrl+Q" 
    }));

    tray.setToolTip("PlexWrap");
    tray.setContextMenu(contextMenu);

    tray.on("click", function() {
        win.show();
    });

    // Set Shortcuts
    globalShortcut.register("CmdOrCtrl+R",  () => {
        win.reload();
    });
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
