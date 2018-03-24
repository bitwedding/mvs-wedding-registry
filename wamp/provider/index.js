let autobahn = require('autobahn'),
    config = require('./config/config.js'),
    autobahn_config = require('./config/autobahn.js');

function onchallenge(session, method, extra) {
    if (method === "wampcra") {
        return autobahn.auth_cra.sign(autobahn_config.key, extra.challenge);
    } else {
        return null;
    }
}

var connection = new autobahn.Connection({
    url: autobahn_config.url,
    realm: autobahn_config.realm,
    authmethods: ["wampcra"],
    authid: autobahn_config.user,
    onchallenge: onchallenge
});

connection.onerror = console.log;

connection.onopen = function(session, details) {

    console.info('connected to ' + details.transport.url + ' ' + details.realm);
    console.info('authenticated as ' + details.authid + ' with role ' + details.authrole);

    console.log(config.task);

    switch (config.task) {
        case 'listings':
        let listings1 = require('./models/listings.js')();
        setup_schedules(listings1, 'public.listings', config.timer.listings);
        break;
    }

    var my_subscriptions = {};

    //Setup schedules updates
    function setup_schedules(source, uri, update_timer) {
        console.info('will provide ' + uri);
        //Define update schedules
        if(source.init!==undefined){
            source.init();
        }
        setInterval(() => {
            source.update().then((changes) => {
		    console.log(changes);
                if ((Array.isArray(changes) && changes.length) || ((!Array.isArray(changes)) && changes)) {
                    session.publish(uri, update_payload(changes));
                }
            });
        }, update_timer);
        //Subscribe to own topics in order to make sure there is at least one subscription for the topics (and a subscription id)
        session.subscribe(uri, console.info);
        //Lookup and store the subscription ids of our topics
        setTimeout(() => {
            session.call("wamp.subscription.lookup", [uri]).then((result) => {
                if (result) {
                    my_subscriptions[result] = {
                        uri: uri,
                        init: source.get
                    };
                }
            });
        }, 1000);
    };

    function update_payload(payload) {
        return prepare_payload(payload, 'u');
    }

    function init_payload(payload) {
        return prepare_payload(payload, 'i');
    }

    function prepare_payload(payload, type) {
        return [payload, type];
    }

    //Listen to new subscriptions and send initialization
    session.subscribe('wamp.subscription.on_subscribe', (data) => {
        if (my_subscriptions[data[1]] !== undefined) {
            session.publish(my_subscriptions[data[1]].uri, init_payload(my_subscriptions[data[1]].init()), {}, {
                eligible: [data[0]]
            });
        }
    });
};

connection.open();
