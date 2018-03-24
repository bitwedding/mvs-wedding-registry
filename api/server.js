'use strict';

//Load express
var express = require('express');
var app = express();

//Load app config file
var config = require('./config/config.js');

//Load routes definition
var router = require('./controllers/index.js');

//Enable body parsing
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//HTTP Method overwriter to set error response codes
var methodOverride = require('method-override');
var message = require('./models/message.js');
app.use(methodOverride());
app.use((err, req, res, next) => {
    res.status(500).json(message(0, 'ERR_SERVER_ERROR'));
});

//Set CORS handling
app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Define routes
app.use(router.routes);

//Startup the services
function start() {
    console.info("List %i listings per page", config.app.pagesize);
    if(!process.env.PAGESIZE)
        console.info("To adjust pagesize set environment variable PAGESIZE");
    //Load http service
    if (config.app.http.port != undefined && config.app.http.port != '') {
        app.listen(config.app.http.port, () => console.info('API server running on port ' + config.app.http.port));
    }
};

//Error handling
process.on('uncaughtException', (err) => {
    if (err.code == 'EADDRINUSE')
        console.error('API server could not start. Port already in use');
    else
        console.error('API server error: ' + err);
    process.exit('SIGTERM');
});

start();
