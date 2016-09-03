var exports = module.exports = {};
var mathUtil = require("../util/mathUtil.js");

exports.greet = function(msg, callback, fallback) {
    var truthTable = [
        ["Thanks", ["Welcome","My Pleasure :)"]],
        ["Bye", ["Bye", "Fir milenge haste haste","Have a nice day. :)", "Keep smiling :)"]]
    ];

    var status = false;
    var msgUpr = msg.toUpperCase();
    for(var i=0;i<truthTable.length;i++) {
        if(msgUpr === truthTable[i][0].toUpperCase()) {
            var message = truthTable[i][1][mathUtil.randFrom(0,truthTable[i][1].length-1)];
            callback(message);
            status = true;
            break;
        }
    }
    !status && fallback();
}
