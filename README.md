# mvs-wedding-registry

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

# API
Create listing:
```
curl -X POST -d '{"male": "haensel", "female":"graetel", "date": "2013-05-27"}'  -H "Content-Type: application/json" http://127.0.0.1/listing
```
Get listing by id:
```
curl -X GET "http://127.0.0.1:80/listing/:id"
```
List listings:
```
curl -X GET "http://127.0.0.1:80/listings/:older_than_id"
```
