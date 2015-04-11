var async = require('async'),
    instagram = require('./instagram'),
    twitter = require('./twitter');

module.exports = function (i, callback) {
  async.parallel([
      function (callback) {
        instagram(null, function (data) { return callback(null, data); })
      },
      function (callback) {
        twitter(null, function (data) { return callback(null, data); })
      }
    ], function (err, data) {
      var obj = {
        urls: [(data[0].next_url || ''), (data[1].next_url || '')],
        images: [].concat((data[0].images || []), (data[1].tweets || []))
      }

      return callback(obj);
  });
  return true;
}
