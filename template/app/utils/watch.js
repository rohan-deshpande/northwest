
const watch = function () {
    let fs = require('fs-extra');

    function hotload(task) {

    }

    function makeAppAssetsDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    function watchSrc(config) {

    }

    function watchApp(config) {
        
    }

    fs.readJson('watcher.json', (err, config) => {
        console.log(err);

        makeAppAssetsDir(config.assets.app);
        watchSrc(config);
        watchApp(config);
    });

}

var WatchTower = class WatchTower {
    constructor() {
        this.fs = require('fs-extra');
        this.fs.readJson('package.json', (err, config) => {
            console.log(err);
            this.config = config;
            this.watchSrcCss();
            this.watchSrcJs();
            this.watchSrcMedia();
            this.watchAppCss();
            this.watchAppJs();
        });

        return this;
    }

    hotload(task) {
        console.log('hotload');
        location.reload();
        task.close();
    }

    watchSrcCss() {
        let task = this.fs.watch(this.config.assets.css, (eventType, filename) => {
            this.fs.copy(
                this.config.assets.css + filename,
                "assets/css/app.css",
                (err) => {
                    console.log(err);
                }
            );
        });
    }

    watchSrcJs() {
        let task = this.fs.watch(this.config.assets.js, (eventType, filename) => {
            this.fs.copy(
                this.config.assets.js + filename,
                "assets/js/app.js",
                (err) => {
                    console.log(err);
                }
            )
        });
    }

    watchSrcMedia() {
        let task = this.fs.watch(this.config.assets.media, (eventType, filename) => {
            this.fs.copy(
                this.config.assets.media,
                "assets/",
                (err) => {
                    console.log(err);
                }
            )
        });
    }

    watchAppCss() {
        let task = this.fs.watch("assets/css/app.css", (eventType, filename) => {
            this.hotload(task);
        });
    }

    watchAppJs() {
        let task = this.fs.watch("assets/js/app.js", (eventType, filename) => {
            this.hotload(task);
        });
    }
}
