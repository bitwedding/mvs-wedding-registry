var autobahn = require('autobahn');

var connection = new autobahn.Connection({
    url: 'ws://127.0.0.1:8080/ws',
    realm: 'realm1'
});

connection.onopen = (session, details) => {
    console.log('connected to ' + session._socket.info.url + ' ' + session._realm);
    console.log('session id: ' + session._id);
    session.subscribe('public.listings', (data) => console.log(data));
};

connection.open();
