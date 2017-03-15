#!/usr/bin/env node

'use strict';

const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const allowed = [
    'main',
    'm',
    'css',
    'c',
    'js',
    'j',
    'static',
    'st',
    'version',
    'v'
]
const defaults = {
    css: 'assets/css/app.css',
    js: 'assets/js/app.js',
}
const args = process.argv;
const argsNum = args.length;

/**
 * Outputs the error to the console and exits the process.
 *
 * @param {string} err - the error message to display
 * @return void
 */
function die(err) {
    console.error(chalk.bgRed(err));
    process.exit(1);
}

/**
 * Parses the process.argv arguments. Starts parsing from arg index 2.
 *
 * @return {object} settings - an object containing settings for dev
 */
function parseArgs() {
    let settings = defaults;

    if (argsNum === 2) {
        return settings;
    }

    for (let i = 2; i < argsNum; i++) {
        let arg = args[i].split('=');
        let argKey = arg[0];
        let argValue = arg[1];

        if (allowed.indexOf(argKey) < 0) {
            die(chalk.bgRed(`The argument ${chalk.italic(argKey)} is invalid`));
        }

        switch (argKey) {
            case 'main':
            case 'm':
                settings.main = argValue;
                break;
            case 'css':
            case 'c':
                settings.css = argValue;
                break;
            case 'js':
            case 'j':
                settings.js = argValue;
                break;
            case 'static':
            case 'st':
                settings.static = argValue;
                break;
            case 'version':
            case 'v':
                settings.version = argValue;
                break;
        }
    }

    return settings;
};

/**
 * Reads the manifest.json file and passes its contents to the callback.
 *
 * @param {function} callback - callback to execute after the json is read
 */
function readManifest(callback) {
    fs.readJson('app/package.json', 'utf8', (err, contents) => {
        if (err) {
            die(chalk.bgRed('Unable to read nwjs manifest'))
        }

        callback(contents);
    });
};

/**
 * Spawns the nw process and passes the app directory to it.
 *
 * @return void
 */
function nw() {
    spawn.sync(
        'nw',
        ['app'],
        { stdio: 'inherit' }
    );
}

/**
 * Uses settings to configure the dev enviornment.
 *
 * @return void
 */
function dev() {
    const settings = parseArgs();

    readManifest((manifest) => {
        let dirname, dest;

        manifest['main'] = settings.main || manifest.main;
        manifest['node-remote'] = (manifest.main.includes('http')) ? `${manifest.main}/*` : '<all_urls>';
        manifest['version'] = settings.version || manifest.version;

        if (settings.static) {
            dirname = settings.static.split('/').pop();
            dest = `app/assets/${dirname}`;

            fs.ensureDirSync(dest, (err) => {
                if (err) die(err)
            });

            fs.copySync(settings.static, dest, (err) => {
                if (err) die(err)
            });
        }

        console.log('going to write to package.json');

        fs.writeJson('app/package.json', manifest, (err) => {
            if (err) die(err);

            ejs.renderFile('app/index.ejs', {css: settings.css, js: settings.js}, (err, html) => {
                if (err) die(err);

                fs.outputFile('app/index.html', html, (err) => {
                    if (err) die(err);

                    nw();
                });
            });
        });
    });
};

dev();
