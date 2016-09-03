var login = require("facebook-chat-api");

var http = require('http');
var fs = require('fs');
var path = require('path');

var express = require('express');
var app = express();

// Simple echo bot. He'll repeat anything that you say.
// Will stop when you say '/stop'

login({
    email: "fbbott@gmail.com",
    password: "l0ve!slife"
}, function callback(err, api) {
    if (err) return console.error(err);

    api.setOptions({
        listenEvents: true
    });

    var stopListening = api.listen(function(err, event) {
        if (err) return console.error(err);

        switch (event.type) {
            case "message":
                if (event.body === '/stop') {
                    api.sendMessage("Goodbye...", event.threadID);
                    return stopListening();
                }
                api.markAsRead(event.threadID, function(err) {
                    if (err) console.log(err);
                });
                var msg = intelligence(event, api);
                if (msg && msg.length > 0) {
                    api.sendMessage(msg, event.threadID);
                }
                break;
            case "event":
                console.log(event);
                break;
        }
    });
});

function intelligence(event, api) {
    var msg = event.body;
    var target = "";
    if (msg) {
        for (var i = 0; i < msg.length; i++) {
            target += i % 2 == 0 ? msg[i].toUpperCase() : msg[i];
        }
    }
    return target;
}

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 3000!');
});

console.log('Server running at http://127.0.0.1:5000/');


// Gets any user based on graph match by facebook.
// api.getUserID("abcd", function(err, data) {
//     if(err) return callback(err);
//
//     // Send the message to the best match (best by Facebook's criteria)
//     var threadID = data[0].userID;
//     api.sendMessage("Happy Birthday", threadID);
// });
