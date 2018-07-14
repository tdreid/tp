#!/usr/bin/env node

'use strict';

const tp = require('commander');
const version = require('./package.json').version;

tp
    .version(version)
    .parse(process.argv);

if (tp.args.length === 0) tp.help();
