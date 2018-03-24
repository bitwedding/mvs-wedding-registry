'use strict';

//Set up database
var mongo = require('../libraries/mongo.js');
var config = require('../config/config.js');

module.exports = () => {
    this.listings = [];
    this.last_known = 0;
    return {
        init: () => {
            listLastListings(10).then((listings) => {
                this.last_known = listings[0].id;
                this.listings = listings;
            });
        },
        update: () => {
            return new Promise((resolve, reject) => {
                listNewListings(this.last_known, 10)
                    .then((listings) => {
                        listings.forEach((listing) => {
                            if (listing.id > this.last_known) {
                                this.listings = new Array(listing).concat(this.listings);
                                this.last_known = listing.id;
                            }
                        });
                        this.listings = this.listings.slice(0, 10);
                        resolve(listings);
                    });
            });
        },
        get: () => this.listings
    };
};

function listLastListings(number) {
    return new Promise((resolve, reject) => {
        mongo.connect()
            .then((db) => {
                db.collection('listing').find({}, {
                    _id: 0
                }).sort({
                    'id': -1
                }).limit(number).toArray((err, docs) => {
                    if (err) throw Error(err.message);
                    else
                        resolve(docs);
                });
            });
    });
}

function listNewListings(last_known, number) {
    return new Promise((resolve, reject) => {
        mongo.connect()
            .then((db) => {
                db.collection('listing').find({
                    'id': {
                        '$gt': last_known
                    }
                }, {
                    _id: 0
                }).limit(number).toArray((err, docs) => {
                    if (err) throw Error(err.message);
                    else
                        resolve(docs);
                });
            });
    });
}
