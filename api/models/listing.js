'use strict';

//Set up database
var mongo = require('../libraries/mongo.js');
var config = require('../config/config.js');

module.exports = {
    create: create,
    fetch: fetch,
    list: list
};

function fetch(id) {
    return mongo.connect()
        .then((db) => {
            return db.collection('listing').findOne({
                id: id
            }, {
                _id: 0
            }).then((doc) => {
                return doc;
            });
        });
}

function list(upper, pagesize) {
    return new Promise((resolve,reject)=>{
     mongo.connect()
        .then((db) => {
            return db.collection('listing').find({
                id: { "$lt": upper}
            }, {
                _id: 0
            }).sort({id:-1}).limit(pagesize).toArray((err, listings) => {
                if(err) throw Error('ERR_LIST_LISTINGS');
                resolve(listings);
            });
        });
    });
}

function getNextSequence(name) {
    return mongo.connect()
        .then((db) => {
            return db.collection('counters').findAndModify({
                    _id: name
                }, {}, {
                    $inc: {
                        seq: 1
                    }
                })
                .then(ret => ret.value.seq);
        });
}

function create(male, female, date) {
    return getNextSequence("listingid")
        .then((id) => {
            return mongo.connect()
                .then((db) => db.collection('listing').insertOne({
                    id: id,
                    male: male,
                    female: female,
                    date: date
                }))
                .then(() => id);
        });
}
