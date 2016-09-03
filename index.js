var login = require("facebook-chat-api");

var http = require('http');
var fs = require('fs');
var path = require('path');

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

http.createServer(function (request, response) {

   console.log('request starting for ');
   console.log(request);

   var filePath = '.' + request.url;
   if (filePath == './')
       filePath = './index.html';

   console.log(filePath);
   var extname = path.extname(filePath);
   var contentType = 'text/html';
   switch (extname) {
       case '.js':
           contentType = 'text/javascript';
           break;
       case '.css':
           contentType = 'text/css';
           break;
   }

   path.exists(filePath, function(exists) {

       if (exists) {
           fs.readFile(filePath, function(error, content) {
               if (error) {
                   response.writeHead(500);
                   response.end();
               }
               else {
                   response.writeHead(200, { 'Content-Type': contentType });
                   response.end(content, 'utf-8');
               }
           });
       }
       else {
           response.writeHead(404);
           response.end();
       }
   });

}).listen(process.env.PORT || 5000);

console.log('Server running at http://127.0.0.1:5000/');


// Gets any user based on graph match by facebook.
// api.getUserID("abcd", function(err, data) {
//     if(err) return callback(err);
//
//     // Send the message to the best match (best by Facebook's criteria)
//     var threadID = data[0].userID;
//     api.sendMessage("Happy Birthday", threadID);
// });
