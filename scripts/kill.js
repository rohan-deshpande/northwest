#!/usr/bin/env node

'use strict';

const shell = require('shelljs');
const chalk = require('chalk');

console.log(chalk.magenta('Unseeding...'));

shell.exec('rm -rf src/*');

console.log(chalk.magenta('Unseeded'));