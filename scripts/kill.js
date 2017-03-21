#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const chalk = require('chalk');

console.log(chalk.magenta('Unseeding...'));

fs.emptyDirSync('src');

console.log(chalk.magenta('Unseeded'));
