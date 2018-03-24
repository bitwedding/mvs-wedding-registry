let MongoClient = require('mongodb').MongoClient,
    mongo_config = require('../config/mongo.js');

var _db;

module.exports = {
    'connect': connect
};

function connect() {
    return new Promise((resolve, reject) => {
        if (_db !== undefined)
            resolve(_db);
        else {
            let url = 'mongodb://' + mongo_config.host + ':' + mongo_config.port + '/' + mongo_config.database;
            MongoClient.connect(url, function(err, db) {
                if (err) throw Error(err.message);
                else {
                    resolve(db);
                    _db = db;
                }
            });
        }
    });
}
