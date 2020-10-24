(function () {
    const nodeConsole = require("console"),
        myConsole = new nodeConsole.Console(
            process.stdout,
            process.stderr
        ),
        {
            log,
            error
        } = myConsole
    remote = require("electron").remote;

    function Init() {
        let minBtn = document.getElementById("min-btn"),
            maxBtn = document.getElementById("max-btn"),
            closeBtn = document.getElementById("close-btn");

        window.addEventListener("resize", (e) => {
            const window = remote.getCurrentWindow();
            if (window.isMaximized())
                document.body.classList.add("maximized");
            else
                document.body.classList.remove("maximized");
        });

        minBtn.addEventListener("click", (e) => {
            const window = remote.getCurrentWindow();
            window.minimize();
        });

        maxBtn.addEventListener("click", (e) => {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized())
                window.maximize();
            else
                window.unmaximize();
        });

        closeBtn.addEventListener("click", (e) => {
            const window = remote.getCurrentWindow();
            window.hide();
        });
    }

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            Init();
        }
    };
})();
