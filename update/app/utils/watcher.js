const watcher = class watcher {
    constructor() {
        this.fs = require('fs-extra');
        this.map = null;

        return this;
    }

    watch(config = 'package.json') {
        this.fs.readJson(config, (err, contents) => {
            if (err) {
                return console.warn(err);
            }

            this.src = contents.assets.src;
            this.app = contents.assets.app;

            this.watchSrc()
                .watchApp();
        });
    }

    watchSrc() {
        let src = this.src;
        let app = this.app;
        let cssWatcher = this.fs.watch(src.dir + src.css, (eventType, filename) => {
            this.fs.copy(
                src.dir + src.css,
                app.css.path + app.css.name,
                (err) => {
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        });

        let jsWatcher = this.fs.watch(src.js, (eventType, filename) => {
            this.fs.copy(
                src.js,
                this.map.js.path + this.map.js.name,
                (err) => {
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        });


        /**
         * Copies the entire src 'media' directory to the app 'assets' directory.
         * Necessary as CSS will reference a specific structure for images/fonts etc.,
         *
         */
        let mediaWatcher = this.fs.watch(src.media, (eventType, filename) => {
            this.fs.ensureDir(this.)
            this.fs.copy(
                src.media,
                this.app,
                (err) => {
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        });

        return this;
    }

    watchApp() {
        let app = this.app;
        let task = this.fs.watch(app, (eventType, filename) => {
            this.hotload(task);
        });

        return this;
    }

    hotload(task) {
        location.reload();
        task.close();
    }
}
