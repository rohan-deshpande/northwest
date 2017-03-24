#!/usr/bin/env node

'use strict';

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
];
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
  process.exit(0);
}

/**
 * Parses the process.argv arguments. Starts parsing from arg index 2.
 *
 * @return {object} settings - an object containing settings for dev
 */
function parseArgs() {
  let settings = {};

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
  process.env.NODE_ENV = 'development';
  
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
    manifest['main'] = settings.main || manifest.main;
    manifest['node-remote'] = (manifest.main.includes('http')) ? `${manifest.main}/*` : '<all_urls>';
    manifest['version'] = settings.version || manifest.version;

    // if we have a static directory, copy it over
    if (settings.static) {
      fs.copy(settings.static, `app/assets/${path.basename(settings.static)}`, (err) => {
        if (err) die(err)
      });
    }

    // if we have css, copy it over
    if (settings.css) {
      fs.copySync(settings.css, `app/${css}`, (err) => {
        if (err) die(err);
      });
    }

    // got js? copy it
    if (settings.js) {
      fs.copySync(settings.js, `app/${js}`, (err) => {
        if (err) die(err);
      });
    }

    // write the mutated manifest
    fs.writeJson('app/package.json', manifest, (err) => {
      if (err) die(err);

      // spawn nw and run it
      nw();
    });
  });
};

dev();
