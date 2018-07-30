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
        .then((db) => db.collection('listing'))
        .then(collection => collection.findOne({
            id: id
        }, {
            _id: 0
        }));
}

function list(upper, pagesize) {
    return mongo.connect()
        .then((db) => db.collection('listing'))
        .then(collection => collection.find({
            id: {
                "$lt": upper
            }
        }, {
            _id: 0
        }).sort({
            id: -1
        }).limit(pagesize))
        .then(result => result.toArray())
        .then(listings => {
            if (!listings) throw Error('ERR_LIST_LISTINGS');
            else
                return listings;
        });
}

function getNextSequence(name) {
    return mongo.connect()
        .then((db) => 
            db.collection('counters').findAndModify({
                    _id: name
                }, {}, {
                    $inc: {
                        seq: 1
                    }
                })
                .then(ret => {
                    if (ret.value) {
                        return ret.value.seq;
                    } else {
                        return db.collection('counters').insertOne({
                            _id: name,
                            seq: 2
                        }).then(() => 1);
                    }
                })
        );
}

function create(partners, date) {
    return getNextSequence("listingid")
        .then((id) => {
            return mongo.connect()
                .then((db) => db.collection('listing').insertOne({
                    id: id,
                    partners: partners,
                    date: date
                }))
                .then(() => id);
        });
}
