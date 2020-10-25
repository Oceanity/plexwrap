'use strict';

const { app, BrowserWindow, globalShortcut, Menu, MenuItem, Tray, shell } = require("electron");
const isMac = process.platform === 'darwin';

let win = null,
    tray = null,
    contextMenu = null,
    showItem = null,
    hideItem = null,
    hidden = false;

function Init() {
    // Create Window
    win = new BrowserWindow({
        icon: `${__dirname}/images/plexwrap.ico`,
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
    win.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });

    // Events
    win.on("hide", () => { hidden = true; });
    win.on("show", () => { hidden = false; });

    // Create Tray Menu
    tray = new Tray(`${__dirname}/images/${ isMac ? "tray-square-mac.png" : "tray-square.png"}`);

    contextMenu = new Menu();
    contextMenu.append(new MenuItem({
        label: "Plex Wrap",
        icon: `${__dirname}/images/github.png`,
        click: () => {
            shell.openExternal("https://github.com/oceanity/plexwrap");
        }
    }));
    contextMenu.append(new MenuItem({
        label: "by @Oceanity",
        icon: `${__dirname}/images/twitter.png`,
        click: () => {
            shell.openExternal("https://twitter.com/oceanity");
        }
    }));
    contextMenu.append(new MenuItem({ type: "separator" }));
    contextMenu.append(new MenuItem({
        label: "Reload",
        accelerator: "CommandOrControl+R",
        click: () => {
            win.reload();
        } 
    }));
    contextMenu.append(new MenuItem({ type: "separator" }));
    contextMenu.append(new MenuItem({
        label: "Quit Plex Wrap",
        role: "quit"
    }));

    tray.setToolTip("PlexWrap");
    tray.setContextMenu(contextMenu);

    tray.on("click", TrayClick);

    // Register Global Shortcuts
    globalShortcut.register("VolumeUp", () => {
        console.log("[Volume Up]");
    });
    globalShortcut.register("VolumeDown", () => {
        console.log("[Volume Down]");
    });
    globalShortcut.register("VolumeMute", () => {
        console.log("[Volume Mute]");
    });
    globalShortcut.register("MediaStop", () => {
        console.log("[Stop]");
    });
    globalShortcut.register("MediaPlayPause", () => {
        console.log("[Play/Pause]");
    });
    globalShortcut.register("MediaNextTrack", () => {
        console.log("[Next Track]");
    });
    globalShortcut.register("MediaPreviousTrack", () => {
        console.log("[Previous Track]");
    });
}

// Tray Click
function TrayClick() {
    if (!isMac) {
        if (hidden) {
            win.show();
        }
        if (!win.isFocused()) {
            win.focus();
        }
    }
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
