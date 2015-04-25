var async = require('async'),
    Handlebars = require('handlebars'),
    fs = require('fs'),
    instagram = require('../instagram'),
    twitter = require('../twitter'),
    templates = {
      images: fs.readFileSync(__dirname + '/../templates/images.hbs', {encoding: 'utf-8'})
    },
    timeSince = function (ms) {
      var d, h, m, s;
      s = Math.floor(ms / 1000);
      m = Math.floor(s / 60);
      s = s % 60;
      h = Math.floor(m / 60);
      m = m % 60;
      d = Math.floor(h / 24);
      h = h % 24;
      return { d: d, h: h, m: m, s: s };
    };

module.exports = function (data, callback) {
  var res = data.res;

  async.parallel(
    [
      function (callback) {
        instagram(null, function (data) {
          return callback(null, data);
        });
      },

      function (callback) {
        twitter(null, function (data) {
          return callback(null, data);
        });
      }
    ],

    function (err, data) {
      var obj = {
        images: [].concat((data[0].images || []), (data[1].tweets || []))
      };

      obj.images.sort(function (a, b) {
        return a.timestamp - b.timestamp;
      });
      obj.images.reverse();

      Handlebars.registerHelper('time-since', function (context, options) {
        var curTime = new Date().getTime(),
            postedAt = new Date(context*1000).getTime(),
            time = timeSince((curTime - postedAt));

        if (time.d > 0) {
          return time.d + ' day' + (time.d > 1 ? 's' : '') +' ago';
        }

        if (time.h > 0) {
          return time.h + ' hour' + (time.h > 1 ? 's' : '') +' ago';
        }

        if (time.m > 0) {
          return time.m + ' minute' + (time.m > 1 ? 's' : '') +' ago';
        }

        if (time.s > 0) {
          return time.s + ' second' + (time.s > 1 ? 's' : '') +' ago';
        }

      });

      var template = Handlebars.compile(templates.images),
          html = template(obj);

      res.write(html);

      return callback();
  });
  return true;
};
