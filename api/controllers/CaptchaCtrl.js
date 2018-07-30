'use strict';

var Message = require('../models/message.js');
var Captcha = require('../models/captcha.js');

exports.get = get;

function get(req, res) {
    var captcha = Captcha.get();
    res.type('svg');
    res.status(200).send(captcha);
};
