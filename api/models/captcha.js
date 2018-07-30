'use strict';

let Redis = require("redis"),
    config = require('../config/captcha.js'),
    Captcha = require('svg-captcha'),
    bluebird = require('bluebird');

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

let redis_config = require('../config/redis.js'),
    redis = Redis.createClient(redis_config.config);

exports.get = () => {
    var captcha = Captcha.create({
        size: config.length,
        ignoreChars: config.blacklist,
        noise: config.noise,
        color: config.color,
        background: config.background
    });
    redis.set('CAPTCHA_' + captcha.text, 1, 'EX', config.expire);
    return captcha.data;
};

exports.check = (code) => {
    return redis.getAsync('CAPTCHA_' + code)
        .then(result => {
            if (result == 1) {
                redis.del('CAPTCHA_' + code);
                return true;
            } else {
                throw Error('ERR_CAPTCHA_INVALID');
            }
        });
}
