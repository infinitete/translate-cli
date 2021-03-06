#!/usr/bin/env node

const got = require('got');
const Chalk = require('chalk');
const crypto = require('crypto');
const FormData  = require('form-data');

const app = '20180126000118750';
const sec = '7g0cI100ovn8masEITi4';
const md5 = crypto.createHash('md5');

const baseUrl = `https://fanyi-api.baidu.com/api/trans/vip/translate`;
const targets = [{from: 'zh', to: 'en'}, {from: 'en', to: 'zh'}];

/**
 ** default english to chinese
 **/
let st = targets[1];
let words = process.argv.slice(2).join(' ');

/**
 * option -c or -C  chinese to english
 */
if (process.argv.findIndex(k => k.toLowerCase() === '-c') === 2) {
    st = targets[0];
    words = process.argv.slice(3).join(' ');
}


const salt  = Math.random().toString(19).split('.').slice(1).join('');
const chars = `${app}${words}${salt}${sec}`;

md5.update(chars);

const sign = md5.digest('hex');

let body = Object.assign({}, st, { q: words, appid: app, salt, sign });
let form = new FormData();

for (let k in body) {
    form.append(k, body[k]);
}

(async () => {
    let res = await got.post(baseUrl, {body: form});
    res = JSON.parse(res.body);
    let dst = res.trans_result[0].dst;
    let winSize = require('window-size');

    console.log();
    console.log(Chalk.red.bold(words));
    console.log('-'.repeat(winSize.width));
    console.log(Chalk.greenBright.bold(dst));
    console.log();

})();
