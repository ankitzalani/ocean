var request = require('request');
var exports = module.exports = {};

exports.synonym = function(str, callback, fallback) {
    if (str.includes('define ') && str.match(/ /g).length == 1) {
        callDict(str.substr('define '.length), callback, fallback);
    } else if (!str.includes(' ')) {
        callDict(str, callback, fallback);
    } else {
        fallback();
    }
}

callDict = function(str, callback, fallback) {
  request('http://words.bighugelabs.com/api/2/44e8182f6018a90c89d32bc512bca5dd/' + str + '/json', function(error, response, body) {
      if (!error && response.statusCode == 200 && body) {
          var obj = JSON.parse(body);
          if (obj) {
              if (obj && obj.noun && obj.noun.syn) {
                  var msg = obj.noun.syn[Math.floor(Math.random() * (obj.noun.syn.length - 1)) + 0];
                  callback(msg);
              } else if (obj && obj.adjective && obj.adjective.syn) {
                  var msg = obj.adjective.syn[Math.floor(Math.random() * (obj.adjective.syn.length - 1)) + 0];
                  callback(msg);
              } else if (obj && obj.adverb && obj.adverb.syn) {
                  var msg = obj.adverb.syn[Math.floor(Math.random() * (obj.adverb.syn.length - 1)) + 0];
                  callback(msg);
              } else {
                  fallback();
              }
          } else {
              fallback();
          }
      }
  });
}
