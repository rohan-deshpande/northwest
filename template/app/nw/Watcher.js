const Watcher = class Watcher {
    constructor(config = 'package.json') {
        this.fs = require('fs-extra');
        this.watch = require('glob-watcher');
        this.path = require('path');

        this.fs.readJson(config, (err, contents) => {
            if (err) return console.log(err);

            this.src = contents.assets.src;
            this.app = contents.assets.app;

            this.watchSrc().watchApp();
        });

        return this;
    }

    /**
     * Watches a file and copies it to the destination.
     *
     * @param {string} file - the location of the file to watch
     * @param {string} dest - the destination to copy the file to
     */
    watchFile(file, dest) {
        if (!file || file === '') {
            return;
        }

        this.watch(file).on('change', (path, stat) => {
            this.fs.copy(path, dest, (err) => {
                if (err) console.log(err);
            });
        });
    }

    /**
     * Watches a directory and copies it and all of its contents to the destination.
     *
     * @param {string} dir - the directory to watch
     * @param {string} dest - the destination to copy to
     * @return void
     */
    watchDir(dir, dest) {
        let rel, dirname;

        if (!dir || dir === '') {
            return;
        }

        this.watch(dir).on('change', (path, stat) => {
            rel = this.path.dirname(path);
            dirname = rel.split('/').pop();

            this.fs.ensureDir(dest + dirname, (err) => {
                if (err) console.log(err);
            });

            this.fs.copy(dir, dest + dirname, (err) => {
                if (err) console.log(err);
            });
        })
    }

    /**
     * Watches the src and copies its files and directories to their required app locations.
     *
     * @return {object} watcher
     */
    watchSrc() {
        let app = this.app;
        let dest = {
            css: `${app.dir}${app.css.path}${app.css.namespace}.css`,
            js: `${app.dir}${app.js.path}${app.js.namespace}.js`,
            media: `${app.dir}/`
        }
        let css = this.watchFile(this.src.bundles.css, dest.css);
        let js = this.watchFile(this.src.bundles.js, dest.js);
        let media = this.watchDir(this.src.media, dest.media);

        return this;
    }

    /**
     * Watches the provided app directory and calls the hotload method.
     *
     * @return {object} watcher
     */
    watchApp() {
        let task = this.fs.watch(this.app.dir, (eventType, filename) => {
            this.hotload(task);
        });

        return this;
    }

    /**
     * Reloads the location.
     *
     * @param {object} task - the task that caused the reload
     * @return void
     */
    hotload(task) {
        location.reload();
        task.close();
    }
}
