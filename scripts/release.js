#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const args = process.argv;
const argsNum = args.length;
const manifest = './app/package.json';
const releasesDir = './releases';
const buildDir = `${releasesDir}/build`;
const allowed = ["app", "nwbuild"];
let name, version, releaseDir, settings;

/**
 * Gets the command settings.
 *
 * @param {string} releaseDir - the directory to save the release to
 * @return {object} settings - the command settings
 */
function getSettings(releaseDir) {
    let settings = {
        app: './app',
        nwbuild: [
            '-p',
            'win64,osx64,linux64',
            '-o',
            releaseDir
        ]
    };

    if (argsNum === 2) {
        return settings;
    }

    for (let i = 2; i < argsNum; i++) {
        let arg = args[i].split('=');
        let argKey = arg[0];
        let argValue = arg[1];

        switch (argKey) {
            case "app":
                settings.app = argValue;
                break;
            case "nwbuild":
                settings.nwbuild = argValue.split(' ');
                break;
        }
    }

    // ensure that output directory is always the release directory
    settings.nwBuild.push('-o');
    settings.nwBuild.push(releaseDir);

    return settings;
}

function setup(callback) {

    // read and write the manifest to the build directory
    fs.readJson(manifest, 'utf8', (err, contents) => {
        if (err) {
            die(chalk.bgRed('Unable to read manifest'))
        }

        name = contents.name;
        version = contents.version;
        releaseDir = `${releasesDir}/${version}`;
        settings = getSettings(releaseDir);

        // ensure that releases directory exists.
        fs.ensureDirSync(releasesDir);

        // ensure that a build directory is created.
        fs.ensureDirSync(buildDir);

        // copy the app contents to the build directory
        fs.copySync(settings.app, buildDir);

        // copy the manifest to the build directory
        fs.outputFileSync(`${buildDir}/package.json`, contents);

        // ensure the versioned release directory exists
        fs.ensureDirSync(releaseDir);

        callback(contents);
    });
}

function parseNwjsBuilderArgs() {
    if (!nwjsBuilderArgs) {
        return [
            '-p',
            'win64,osx64,linux64',
            '-o',
            releaseDir
        ];
    }

    return
}

function release() {

}
