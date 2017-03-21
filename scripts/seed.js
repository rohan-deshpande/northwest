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
 * Sprouts the seed. Ensures src directory is writable, runs the appropriate seed command
 * based on the platform provided, adds the Nw module back to the src after seeding.
 *
 * @return void
 */
function sprout() {
  // ensure src directory is empty before writing to it
  fs.emptyDirSync('./src');

  // based on the platform, fill the src directory via the right method
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
      console.error(
        chalk.bgRed(
          "Platform invalid or unrecognised, please check the docs for allowed seed platforms."
        )
      );
      process.exit(1);
      break;
  }

  // put the nw module back in the src directory
  fs.readFile(path.resolve(__dirname, '..', './template/src/nw/index.js'), 'utf8', (err, contents) => {
    if (err) {
      console.error(chalk.bgRed(err));
      process.exit(1);
    }

    fs.outputFileSync('src/nw/index.js', contents);
  });
}

/**
 * Checks to see if a command is allowed.
 *
 * @param {string} cmd - the command to check
 * @return {string} cmd - the command if it was allowed
 */
function ensureAllowed(cmd) {
  if (allowedCommands.indexOf(cmd) > -1) {
    return cmd;
  }

  console.error(
    chalk.bgRed(
      `The command ${chalk.italic(cmd)} is not currently whitelisted, please open a PR if you'd like it to be allowed`
    )
  );
  process.exit(1);
}

/**
 * Seeds the src directory from a git repository.
 *
 * @param {string} seed - the repo to fetch
 * @return void
 */
function seedFromGit(seed) {

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
}

/**
 * Seeds the src from an npm package.
 *
 * @param {string} seed - the npm package to seed from
 * @return void
 */
function seedFromNpmPackage(seed) {

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
}

/**
 * Seeds the src from a global command.
 *
 * @param {string} seed - the npm command to seed from
 * @return void
 */
function seedFromCommand(seed) {
  let cmd = seed.split(" ");

  // ensure that the final argument is to seed into the src directory.
  cmd.push('./src');

  // spawns the command if it is whitelisted and passes its arguments
  spawn.sync(
    ensureAllowed(cmd.shift()),
    [cmd],
    { stdio: 'inherit' }
  );
}

sprout();

console.log(chalk.bgGreen(chalk.black('Seeded!')));
