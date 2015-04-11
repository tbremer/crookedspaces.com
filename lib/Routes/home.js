var async = require('async'),
    Handlebars = require('handlebars'),
    fs = require('fs'),
    templates = {
      home: fs.readFileSync(__dirname + '/../templates/home.hbs', {encoding: 'utf-8'}),
    },
    instagram = require('./instagram'),
    twitter = require('./twitter');

module.exports = function (i, callback) {
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
        urls: [(data[0].next_url || ''), (data[1].next_url || '')],
        images: [].concat((data[0].images || []), (data[1].tweets || [])),
        write: [],
        display_write_end: false,
        write_end: []
      };

      obj.images.sort(function (a, b) {
        return a.timestamp - b.timestamp;
      });

      var template = Handlebars.compile(templates.home),
          html = template(obj);

      obj.write.push(html);
      obj.write_end.push([obj.urls, obj.images]);
      delete obj.urls;
      delete obj.images;

      return callback(obj);
  });
  return true;
};
