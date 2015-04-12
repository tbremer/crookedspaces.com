var async = require('async'),
    Handlebars = require('handlebars'),
    fs = require('fs'),
    instagram = require('./instagram'),
    twitter = require('./twitter'),
    templates = {
      home: fs.readFileSync(__dirname + '/../templates/home.hbs', {encoding: 'utf-8'}),
      images: fs.readFileSync(__dirname + '/../templates/images.hbs', {encoding: 'utf-8'})
    };

module.exports = function (data, callback) {
  res = data.res;

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

      var template = Handlebars.compile(templates.images),
          html = template(obj);

      res.write(html);

      return callback();
  });
  return true;
};
