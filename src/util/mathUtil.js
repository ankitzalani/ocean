var exports = module.exports = {};

exports.randFrom = function(from, to) {
  return Math.floor(Math.random() * to) + from;
}
