#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const shell = require('shelljs');
const assign = require('lodash.assign');
const chalk = require('chalk');
const dir = process.argv[2];
const app = dir + "/app";
const jsonify = (o) => JSON.stringify(o, null, 2);
const basePackage = {
    "main": "index.html",
    "name": dir,
    "version": "0.0.1",
    "window": {
        "title": dir,
        "frame": true,
        "width": 1024,
        "height": 768,
        "position": "center"
    }
};
const watchJson = jsonify({
    "app": {
      "dir": "assets/",
      "css": {
        "path": "css/",
        "namespace": "app"
      },
      "js": {
        "path": "js/",
        "namespace": "app"
      }
    },
    "src": {
      "bundles": {
        "css": "",
        "js": ""
      },
      "static": ""
    }
});
const serverPackageJson = jsonify(assign({}, basePackage, {
        "main": "http://localhost:3000/",
        "node-remote": "http://localhost:3000/*",
    }
));
const packageJson = jsonify(basePackage);

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

console.log(chalk.inverse(`Making ${chalk.bold(dir)}, please wait, this might take a while…`));

fs.copy('./template', dir, (err) => {
    if (err) {
        return console.log(err);
    }

    shell.exec(`
        cd ${dir} && npm i &&
        cd app/dev &&
        echo '${packageJson}' > package.json &&
        echo '${serverPackageJson}' > server.package.json &&
        echo '${watchJson}' > watch.json &&
        cd ../prod &&
        echo '${packageJson}' > package.json
    `);

    console.log(chalk.cyan(`Northwest app ${chalk.bold(dir)} made!`));
    console.log(chalk.cyan(`To seed your app with the JavaScript boilerplate of your choice, just ${chalk.italic('cd')} ${chalk.italic(dir)} and run ${chalk.italic('northwest seed')} passing the platform and seed of your choice. Check the docs for more info.`));
});
