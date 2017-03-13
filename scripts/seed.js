#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const assign = require('lodash.assign');
const src = "src";
const platform = process.argv[2];
const seed = process.argv[3];
const allowedCommands = [
    'create-react-app',
    'vue',
    'ng',
];

if (!seed) {
    throw new Error(chalk.bgRed("You must provide a seed"));
}

if (!fs.existsSync(src)) {
    fs.mkdirSync(src);
}

console.log(chalk.bgGreen(chalk.black('Seeding…')));

/**
 * Pre seeding setup. Removes the nw module from the src directory so it can be written to.
 *
 * @param {function} callback
 * @return void
 */
const preSeed = (callback) => {
    shell.exec(`
        cd src &&
        rm -rf nw;
    `);

    callback();
}

/**
 * Post seed winding up. Ensures the nw module is placed in the src directory of the seed.
 *
 * @return void
 */
const postSeed = () => {
    fs.readFile(path.resolve(__dirname, '..', './template/src/nw/index.js'), 'utf8', (err, contents) => {
        shell.exec(`
            cd src &&
            mkdir nw
            echo '${contents}' > nw/index.js;
        `);
    });
}

/**
 * Seeds the src directory from a git repository.
 *
 * @param {string} seed - the repo to fetch
 * @return void
 */
const seedFromGit = (seed) => {
    preSeed(() => shell.exec(`
        git clone ${seed} src/. &&
        cd src &&
        find . | grep .git | xargs rm -rf &&
        cd ../;
    `));
}

/**
 * Seeds the src from an npm package.
 *
 * @param {string} seed - the npm package to seed from
 * @return void
 */
const seedFromNpmPackage = (seed) => {
    preSeed(() => shell.exec(`
        cd src &&
        npm init -y &&
        npm i -S ${seed} &&
        cd ../;
    `));
}

/**
 * Seeds the src from a global command.
 *
 * @param {string} seed - the npm command to seed from
 * @return void
 */
const seedFromCommand = (seed) => {
    preSeed(() => {
        const cmd = seed.split(" ");
        const result = spawn.sync(
            ensureAllowed(cmd.shift()),
            cmd,
            { stdio: 'inherit' }
        );
    });
}

/**
 * Checks to see if a command is allowed.
 *
 * @param {string} cmd - the command to check
 * @return {boolean}
 */
const ensureAllowed = (cmd) => {
    if (allowedCommands.indexOf(cmd) > -1) {
        return cmd;
    }

    console.error(chalk.bgRed(`The command ${chalk.italic(cmd)} is not currently whitelisted, please open a PR if you'd like it to be allowed`));
    process.exit(1);
}

/**
 * Checks to see if operating system is windows.
 *
 * @return bool
 */
const isWin = () => {
    return require('os').platform().indexOf('win') > -1;
}

switch (platform) {
    case "git":
        seedFromGit(seed);
        break;

    case "npm":
        seedFromNpmPackage(seed);
        break;

    case "cmd":
        seedFromCommand(seed);
        break;

    default:
        console.error(chalk.bgRed("Platform invalid or unrecognised, please check the docs for allowed seed platforms."));
        process.exit(1);
        break;
}

postSeed();

console.log(chalk.bgGreen(chalk.black('Seeded!')));
