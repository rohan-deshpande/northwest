#!/usr/bin/env node

'use strict';

const ejs = require('ejs');
const fs = require('fs-extra');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const allowed = [
    '-main',
    '-m',
    '-css',
    '-c',
    '-js',
    '-j',
    '-static',
    '-st',
    '-version',
    '-v'
]
const defaults = {
    css: 'assets/css/app.css',
    js: 'assets/js/app.js',
}
const args = process.argv;
const argsNum = args.length;
const parseArgs = () => {
    let settings = defaults;

    if (argsNum === 2) {
        return settings;
    }

    for (let i = 2; i < argsNum; i++) {
        let arg = args[i].split('=');
        let argKey = arg[0];
        let argValue = arg[1];

        if (allowed.indexOf(argKey) < 0) {
            console.error(chalk.bgRed(`The argument ${chalk.italic(argKey)} is invalid`));
            process.exit(0);
        }

        switch (argKey) {
            case '-main':
            case '-m':
                settings.main = argValue;
                break;
            case '-css':
            case '-c':
                settings.css = argValue;
                break;
            case '-js':
            case '-j':
                settings.js = argValue;
                break;
            case '-static':
            case '-st':
                settings.static = argValue;
                break;
            case '-version':
            case '-v':
                settings.version = argValue;
                break;
        }
    }

    return settings;
};
const getManifest = (callback) => {
    fs.readJson('manifest.json', 'utf8', (err, contents) => {
        if (err) {
            console.error(chalk.bgRed('Unable to read manifest.json file'));
            process.exit(0);
        }

        callback(contents);
    });
};

const dev = () => {
    const settings = parseArgs();

    getManifest((manifest) => {
        manifest['main'] = settings.main || manifest.main;
        manifest['node-remote'] = (manifest.main.includes('http')) ? `${manifest.main}/*` : '<all_urls>';
        manifest['version'] = settings.version || manifest.version;

        fs.writeJson('manifest.json', manifest);
        fs.writeJson('app/package.json', manifest, (err) => {
            if (err) {
                console.error(chalk.bgRed('Unable to write package.json file'));
                process.exit(0);
            }

            ejs.renderFile('index.ejs', {css: settings.css, js: settings.js}, (err, html) => {
                if (err) {
                    console.error(chalk.bgRed(err));
                    process.exit(0);
                }

                fs.outputFile('app/index.html', html, (err) => {
                    if (err) {
                        console.error(chalk.bgRed(err));
                        process.exit(0);
                    }

                    nw();
                });
            });
        });
    });
};

const nw = () => {
    spawn.sync(
        'nw',
        ['app'],
        { stdio: 'inherit' }
    );
}

dev();
