module.exports = class watcher {
    constructor() {
        this.fs = require('./fs.js');
        this.map = null;

        return this;
    }

    watch(config = 'package.json') {
        fs.readJson(config, (err, contents) => {
            let src, app, map;

            if (err) {
                return console.log(err);
            }

            src = contents.assets.src;
            app = contents.assets.app;
            map = {
                css: {
                    path: `${app}/css/`,
                    name: "app.css",
                },

                js: {
                    path: `${app}/js/`,
                    name: "app.js",
                },

                media: {
                    path: `${app}`
                }
            };

            this.setMap(map)
                .watchSrc(src)
                .watchApp(app);
        });
    }

    setMap(map) {
        this.map = map;

        return this;
    }

    watchSrc(src) {
        let cssWatcher = this.fs.watch(src.css, (eventType, filename) => {
            this.fs.copy(
                src.css + filename,
                this.map.css.path + this.map.css.name,
                (err) => {
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        });

        let jsWatcher = this.fs.watch(src.js, (eventType, filename) => {
            this.fs.copy(
                src.js + filename,
                this.map.js.path + this.map.js.name,
                (err) => {
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        });

        let mediaWatcher = this.fs.watch(src.media, (eventType, filename) => {
            this.fs.copy(
                src.media,
                this.map.media.path,
                (err) => {
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        });

        return this;
    }

    watchApp(assetsDir) {
        let task = this.fs.watch(assetsDir, (eventType, filename) => {
            location.reload();
            task.close();
        });

        return this;
    }
}
