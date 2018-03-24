module.exports = {
    url: (process.env.ROUTER_URL) ? process.env.ROUTER_URL : 'ws://127.0.0.1:8080/ws',
    realm: (process.env.REALM) ? process.env.REALM : 'realm1',
    user: (process.env.WS_USER) ? process.env.WS_USER : 'listingprovider',
    key: (process.env.WS_SECRET) ? process.env.WS_SECRET : 'supersecret'
};
