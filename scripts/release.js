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
  settings = {
    app: './app',
    main: 'index.html',
    nwbuild: [
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
      case "main":
        settings.main = argValue;
        break;
      case "nwbuild":
        settings.nwbuild = argValue.split(' ');
        break;
    }
  }

  return settings;
}

/**
 * Reads the manifest file and passes the results to the callback.
 *
 * @param {function} callback
 * @return void
 */
function readManifest(callback) {
  fs.readJson(manifest, 'utf8', (err, contents) => {
    callback(contents);
  });
}

/**
 * Releases the app for the specified platforms
 *
 * @param {object} manifest - the manifest object
 * @return void
 */
function release(manifest) {
  name = manifest.name;
  version = manifest.version;
  releaseDir = `${releasesDir}/${version}`;
  settings = getSettings(releaseDir);

  // mutate the manifest main to be index.html by default when releasing.
  manifest.main = settings.main;

  // ensure that releases directory exists.
  fs.ensureDirSync(releasesDir);

  // ensure that a build directory is created. We'll remove this later.
  fs.ensureDirSync(buildDir);

  // copy the app contents to the build directory
  fs.copySync(settings.app, buildDir);

  // copy the manifest to the build directory
  fs.outputJsonSync(`${buildDir}/package.json`, manifest);

  // ensure the versioned release directory exists
  fs.ensureDirSync(releaseDir);

  console.log(chalk.bgGreen(chalk.black(`Building ${chalk.bold(name)} v${version} for release…`)));

  // spawn the nwb process
  spawn.sync(
    'nwb',
    ['nwbuild', buildDir].concat(settings.nwbuild),
    { stdio: 'inherit' }
  );

  // remove the temporary build directory
  fs.remove(buildDir);

  console.log(chalk.bgGreen(chalk.black(`${chalk.bold(name)} v${version} has been built!`)));
}

readManifest(manifest => release(manifest));
