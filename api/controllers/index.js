let express = require('express'),
    router = express.Router();

//Load controllers
let ListingCtrl = require('./ListingCtrl.js');

//Caching
let apicache = require('apicache'),
    redis = require('redis'),
    redis_config = require('../config/redis.js'),
    cache = apicache
    .options({
        redisClient: (redis_config.enabled) ? redis.createClient(redis_config.config) : undefined
    })
    .middleware;
//Define cache rules to only cache if result was successfull
const onlyStatus200 = (req, res) => res.statusCode === 200,
    longCacheSuccess = cache('5 minutes', onlyStatus200),
    mediumCacheSuccess = cache('1 minutes', onlyStatus200),
    shortCacheSuccess = cache('20 seconds', onlyStatus200);

/**
 * Get information on a listing.
 * @route GET /listing/{id}
 * @param {number} id.path.required - Listing id
 * @group listing - Operations about listings
 * @returns {object} 200 - Listing details
 */
router.get('/listing/:id', longCacheSuccess, ListingCtrl.FetchListing);

/**
 * Post a new listing.
 * @route POST /listing
 * @group listing - Operations about listings
 * @returns {object} 200 - Listing id
 */
router.post('/listing', ListingCtrl.CreateListing);

exports.routes = router;
