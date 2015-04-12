var get = require('https').get;

module.exports = function (queryString, callback) {
  var options;
  queryString = queryString || '?access_token=16741082.1b07669.121a338d0cbe4ff6a5e04543158a4f82';
  options = {
    host:     'api.instagram.com',
    method:   'GET',
    keepAlive: true,
    path:      '/v1/tags/crookedspaces/media/recent' + queryString,
  };

  get(options, function (res) {
    var obj = '';

    res.on('data', function (data) {
      obj += data;
    });

    res.on('end', function () {
      obj = JSON.parse(obj);

      var returnObj = {
        next_url: '?' + obj.pagination.next_url.split(/\?(.+)?/)[1],
        images: []
      };

      obj.data.forEach(function (el) {
        returnObj.images.push({
          timestamp: new Date(parseInt(el.created_time, 10)).getTime(),
          user: el.user.username,
          image_url: el.images.standard_resolution.url,
          orientation: 'square'
        });
      });

      return callback(returnObj);
    });
  });
};
