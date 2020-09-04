const { app, BrowserWindow } = require("electron");

function Init() {
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
}

app.whenReady().then(Init);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        Init();
    }
});
