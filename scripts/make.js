#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const shell = require('shelljs');
const assign = require('lodash.assign');
const chalk = require('chalk');
const dir = process.argv[2];
const app = dir + "/app";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

console.log(chalk.inverse(`Making ${chalk.bold(dir)}, please wait, this might take a while…`));

fs.copy('./template', dir, (err) => {
    if (err) {
        return console.log(err);
    }

    shell.exec(`cd ${dir} && npm i`);

    console.log(chalk.cyan(`Northwest app ${chalk.bold(dir)} made!`));
    console.log(chalk.cyan(`To seed your app with the JavaScript boilerplate of your choice, just ${chalk.italic('cd')} ${chalk.italic(dir)} and run ${chalk.italic('northwest seed')} passing the platform and seed of your choice. Check the docs for more info.`));
});
