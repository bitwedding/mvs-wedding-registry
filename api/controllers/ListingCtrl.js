'use strict';

//Load Models
var Message = require('../models/message.js');
var Listing = require('../models/listing');

exports.FetchListing = fetch;
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

function create(req, res) {
    var male = req.body.male;
    var female = req.body.female;
    var date = req.body.date;
    Listing.create(male, female, date)
        .then((id) => res.json(Message(1, undefined, id)))
        .catch((error) => {
            console.log(error);
            res.status(404).json(Message(0, 'ERR_CREATE_LISTING'));
        });
};
