var login = require("facebook-chat-api");

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
                api.sendMessage(intelligence(event, api), event.threadID);
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
    for (var i = 0; i < msg.length; i++) {
        target += i % 2 == 0 ? msg[i].toUpperCase() : msg[i];
    }
    return target;
}



// api.getUserID("Ankit Zalani", function(err, data) {
//     if(err) return callback(err);
//
//     // Send the message to the best match (best by Facebook's criteria)
//     var threadID = data[0].userID;
//     api.sendMessage("Happy Birthday", threadID);
// });
