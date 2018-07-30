'use strict';

var config = require('../config/config.js');
//Load Models
var Message = require('../models/message.js');
var Listing = require('../models/listing');
var Captcha = require('../models/captcha.js');

var Helper = require('../libraries/helper.js');
var Redis = require("redis"),
    redis_config = require('../config/redis.js'),
    redis = Redis.createClient(redis_config.config);

exports.FetchListing = fetch;
exports.ListListings = list;
exports.CreateListing = create;

function fetch(req, res) {
    var id = parseInt(req.params.id);
    Listing.fetch(id)
        .then((listing) => res.json(Message(1, undefined, listing)))
        .catch((error) => {
            console.log(error);
            res.status(404).json(Message(0, 'ERR_FETCH_LISTING'));
        });
};

function list(req, res) {
    var upper = parseInt(req.params.upper);
    Listing.list(upper, parseInt(config.app.pagesize))
        .then((listings) => res.json(Message(1, undefined, listings)))
        .catch((error) => {
            console.log(error);
            res.status(404).json(Message(0, 'ERR_FETCH_LISTINGS'));
        });
};

function create(req, res) {

    var partners = [{}, {}];

    if (req.body.partners && req.body.partners[0])
        partners[0].name = req.body.partners[0].name;
    if (req.body.partners && req.body.partners[1])
        partners[1].name = req.body.partners[1].name;
    var date = req.body.date;
    Promise.all([
            Helper.checkError(req.headers['captcha'], "ERR_CAPTCHA_MISSING"),
            Helper.checkError(partners[0].name, "ERR_PARTNER1_NAME_MISSING"),
            Helper.checkError(typeof partners[0].name == "string" && partners[0].name.length < 50, "ERR_PARTNER1_NAME_ILLEGAL"),
            Helper.checkError(partners[1].name, "ERR_PARTNER2_NAME_MISSING"),
            Helper.checkError(typeof partners[1].name == "string" && partners[1].name.length < 50, "ERR_PARTNER2_NAME_ILLEGAL"),
            Helper.checkError(date, "ERR_DATE_MISSING")
        ])
        .then(() => Captcha.check(req.headers['captcha']))
        .then(() => Listing.create(partners, date))
        .then((id) => res.json(Message(1, undefined, id)))
        .catch((error) => {
            res.status(404).json(Message(0, error.message));
        });
};
