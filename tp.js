#!/usr/bin/env node

'use strict';

const tp = require('commander');
const version = require('./package.json').version;

tp
    .version(version)
    .arguments('<payee> <amount> <memo> <interval>')
    .action((payee, amount, memo, interval) => {
        console.log('Called tp with these arguments:', payee, amount, memo, interval);  
    })
    .parse(process.argv);

if (tp.args.length === 0) tp.help();