#!/usr/bin/env node

'use strict';

const version = require('./package.json').version;
const tp = require('commander');

const steem = require('steem');

let currencyTransferred = 0;
let currencyLimit = 0.001;
let currencyIncrement = 0.001;

const incrementCurrencyTransferred = () => {
  currencyTransferred += Number(currencyIncrement);
  console.log(`${currencyTransferred} SBD transferred so far.`);
  if (Number(currencyTransferred) >= Number(currencyLimit)) {
    console.log(`Transfer limit (${currencyLimit}) reached. Exiting.`);
    process.exit();
  }
};

const transfer = (wif, from, to, amount, memo) => {
  steem.api.setOptions({ url: 'https://api.steemit.com' });    
  steem.broadcast.transfer(wif, from, to, amount, memo, function(err, result) {
    if(err){
        console.error(err);
    } else {
        incrementCurrencyTransferred(amount);
    }
  });
};

tp
  .arguments('<payee> <amount> <limit> <memo> <interval>')
  .option('-p, --payor <payor>', 'Payor account on the steem blockchain')
  .option('-w, --wif <wif>', 'Active key for payor account')
  .option(
    '-t, --test',
    'Test mode. Direct transaction(s) to http://testnet.steem.vc'
  )
  .action((payee, amount, limit, memo, interval) => {
    currencyIncrement = amount; 
    currencyLimit = limit;
    setInterval(() => {
       transfer(tp.wif, tp.payor, payee, `${amount} SBD`, memo);
    }, interval * 1000);
  })
  .version(version)
  .parse(process.argv);

if (tp.args.length === 0) tp.help();
