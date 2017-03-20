#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs-extra');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const dir = process.argv[2];
const app = dir + "/app";

console.log(chalk.inverse(`Making ${chalk.bold(dir)}, please wait, this might take a while…`));

// ensure that the directory is made.
fs.mkdirs(dir, (err) => {
    if (err) {
        console.error(chalk.bgRed(err));
        process.exit(0);
    }

    // copy the template to the directory
    fs.copy(path.resolve(__dirname, '..', './template'), dir, (err) => {
        if (err) {
            console.error(chalk.bgRed(err));
            process.exit(0);
        }

        // spawn npm and install
        spawn.sync(
            'npm',
            ['install'],
            { cwd: dir },
            { stdio: 'inherit' }
        );

        console.log(chalk.cyan(`Northwest app ${chalk.bold(dir)} made!`));
        console.log(chalk.cyan(`To seed your app with the JavaScript boilerplate of your choice, just ${chalk.italic('cd')} ${chalk.italic(dir)} and run ${chalk.italic('northwest seed')} passing the platform and seed of your choice. Check the docs for more info.`));
    });
});
