#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const spawn = require('cross-spawn');
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

console.log(chalk.bgGreen(chalk.black('Seeding…')));

/**
 * Pre seeding setup. Removes the nw module from the src directory so it can be written to.
 *
 * @param {function} callback
 * @return void
 */
function preSeed(callback) {
    fs.emptyDirSync('./src');
    callback();
}

/**
 * Post seed winding up. Ensures the nw module is placed in the src directory of the seed.
 *
 * @return void
 */
function postSeed() {
    fs.readFile(path.resolve(__dirname, '..', './template/src/nw/index.js'), 'utf8', (err, contents) => {
        if (err) {
            console.error(chalk.bgRed(err));
            process.exit(1);
        }

        fs.outputFileSync('src/nw/index.js', contents);
    });
}

/**
 * Seeds the src directory from a git repository.
 *
 * @param {string} seed - the repo to fetch
 * @return void
 */
function seedFromGit(seed) {
    preSeed(() => {

        // clone git repo
        spawn.sync(
            'git',
            ['clone', seed, 'src/.'],
            { stdio: 'inherit' }
        );

        // cleanup git files
        shell.exec('find . | grep .git | xargs rm -rf;', {cwd: './src'}, (err, stdout, stderr) => {
            if (err) {
                console.error(chalk.bgRed(`exec error: ${error}`));
                process.exit(1);
            }
        });
    });
}

/**
 * Seeds the src from an npm package.
 *
 * @param {string} seed - the npm package to seed from
 * @return void
 */
function seedFromNpmPackage(seed) {
    preSeed(() => {
        // initialise npm
        spawn.sync(
            'npm',
            ['init', '-y'],
            {  cwd: src, stdio: 'inherit' }
        );

        // auto install seed as dependency
        spawn.sync(
            'npm',
            ['install', seed, '-S'],
            { cwd: src, stdio: 'inherit' }
        );
    });
}

/**
 * Seeds the src from a global command.
 *
 * @param {string} seed - the npm command to seed from
 * @return void
 */
function seedFromCommand(seed) {
    preSeed(() => {
        const cmd = seed.split(" ");

        // ensure that the final argument is to seed into the src directory.
        cmd.push('./src');

        const result = spawn.sync(
            ensureAllowed(cmd.shift()),
            [cmd],
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
function ensureAllowed(cmd) {
    if (allowedCommands.indexOf(cmd) > -1) {
        return cmd;
    }

    console.error(chalk.bgRed(`The command ${chalk.italic(cmd)} is not currently whitelisted, please open a PR if you'd like it to be allowed`));
    process.exit(1);
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
