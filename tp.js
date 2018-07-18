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
  console.log(
    `${(Number(),
    parseFloat(currencyTransferred).toFixed(3))} SBD transferred so far.`
  );
  if (Number(currencyTransferred) >= Number(currencyLimit)) {
    console.log(`Transfer limit (${currencyLimit}) reached. Exiting.`);
    process.exit();
  }
};

const transfer = (wif, from, to, amount, memo) => {
  if (tp.test) {
    steem.api.setOptions({
      url: 'wss://testnet.steem.vc',
      address_prefix: 'STX',
      chain_id:
        '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673'
    });
  } else {
    steem.api.setOptions({ url: 'https://api.steemit.com' });
  }
  steem.broadcast.transfer(wif, from, to, amount, memo, function(err, result) {
    if (err) {
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
  .version(version, '-v, --version')
  .parse(process.argv);

if (tp.args.length === 0) tp.help();
