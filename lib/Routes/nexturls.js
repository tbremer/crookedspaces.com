var async = require('async'),
    instagram = require('./instagram'),
    twitter = require('./twitter'),
    qs = require('querystring');

module.exports = function (data, callback) {
  var res = data.res,
      query = data.query,
      ig_url = query.ig || '',
      tw_url = query.twitter || '',
      returnObj = {
        twitter: {
          full: '',
          parsed: {}
        },
        instagram: {
          full: '',
          parsed: {}
        }
      };

  async.parallel(
    [
      function (callback) {
        instagram(ig_url, function (data) {
          var url = data.next_url.split(/\?(.+)?/)[1];
          returnObj.instagram.full = data.next_url;
          returnObj.instagram.parsed = qs.parse(url);
          return callback(null, null);
        });
      },

      function (callback) {
        twitter(tw_url, function (data) {
          var url = data.next_url.split(/\?(.+)?/)[1];
          returnObj.twitter.full = data.next_url;
          returnObj.twitter.parsed = qs.parse(url);
          return callback(null, null);
        });
      }
    ],

    function (err, data) {
      if (err) {
        return callback(err);
      }

      return callback(null, returnObj);
    }
  );
}
