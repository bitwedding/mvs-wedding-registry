<p align="center">
  <a href="https://www.mvs.org/">
    <img src="images/logo.png" alt="Metaverse">
  </a>
  <h1 align="center">Metaverse Blockchain Wedding Registry</h1>
</p>

# How to use
The easiest way to startup the services is using docker compose. It will automaticlly download and start all dependencies.

# Listing feed
A WAMP service provides a feed for the latest listings.

By default it runs on http://127.0.0.1:8080/ws.

You can start a demo in wamp/test:
```
cd wamp/test
npm install
node listings
```

The websocket will initialize the feed with the 10 most recent listings. Afterwards it will only send you the updates.

You can tell from the 2nd parameter of the data ("i" or "u").

## Feed configuration

| Environment variable | Description                    | Default                |
| ---                  | ---                            | ---                    |
| ROUTER_URL           | URL to WAMP router             | ws://127.0.0.1:8080/ws |
| REALM                | REALM for WAMP                 | realm1                 |
| WS_USER              | Username for WAMP auth         | listingprovider        |
| WS_SECRET            | Passphrase for WAMP auth       | supersecret            |
| LISTINGS_TIMER       | Check for data update interval | 1000 (ms)              |
| MONGO_HOST           | MongoDB host                   | 127.0.0.1              |
| MONGO_PORT           | MongoDB port                   | 27017                  |
| MONGO_NAME           | MongoDB database name          | registry                  |

# API
Create listing:
```
curl -X POST -d '{"partners": [ { "name": "haensel" }, { "name":"graetel" } ], "date": "2013-05-27"}' -H "captcha: test"  -H "Content-Type: application/json" http://127.0.0.1/listing
```
Get listing by id:
```
curl -X GET "http://127.0.0.1:80/listing/:id"
```
List listings:
```
curl -X GET "http://127.0.0.1:80/listings/:older_than_id"
```
Get captcha to add listing:
```
curl -X GET "http://127.0.0.1:80/captcha"
```

## API configuration

| Environment variable | Description                          |   Default |
| ---                  | ---                                  |       --- |
| PORT                 | Port to listen to                    |        80 |
| PAGESIZE             | No of entries for a page of listings |        10 |
| MONGO_HOST           | MongoDB host                         | 127.0.0.1 |
| MONGO_PORT           | MongoDB port                         |     27017 |
| MONGO_NAME           | MongoDB database name                |  registry |
| REDIS_HOST           | Redis host                           | 127.0.0.1 |
| REDIS_PORT           | Redis Port                           |      6379 |
| CAPTCHA_LENGTH       | Length of captcha code               |         6 |
| CAPTCHA_BLACKLIST    | Blacklist characters                 |      0oli |
| CAPTCHA_COLOR        | Colorize the characters              |      true |
| CAPTCHA_BACKGROUND   | Background color                     |   #ffffff |
| CAPTCHA_NOISE        | Number of lines to add noise         |         1 |
| CAPTCHA_EXPIRE       | Expiration time in seconds           |        60 |
