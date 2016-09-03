var login = require("facebook-chat-api");
var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var dict = require("./src/service/dictionary.js");
var greeting = require("./src/service/greeting.js");

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
                api.markAsRead(event.threadID, function(err) {
                    if (err) console.log(err);
                });
                intelligence(event, api, function(msg) {
                    if (msg && msg.length > 0) {
                        api.sendMessage(msg, event.threadID);
                    }
                });

                break;
            case "event":
                console.log(event);
                break;
        }
    });
});

function intelligence(event, api, callback) {
    var msg = event.body;

    var callStack = [greeting.greet, dict.synonym, crush];
    var i = 1;

    if (msg) {
        greeting.greet(msg, callback, nextAlgo);
    }

    function nextAlgo() {
        if (i < callStack.length) {
            var callF = callStack[i];
            i++;
            callF(msg, callback, nextAlgo);
        } else {
            callback("???");
        }
    }
}

function crush(msg, callback, next) {
    var target = "";
    if (msg) {
        for (var i = 0; i < msg.length; i++) {
            target += i % 2 == 0 ? msg[i].toUpperCase() : msg[i];
        }
        callback(target);
    } else {
        next();
    }
}





app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.listen(process.env.PORT || 5001, function() {
    console.log('Example app listening on port 3000!');
});

console.log('Server running at http://127.0.0.1:5000/');
