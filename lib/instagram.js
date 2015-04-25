var get = require('https').get;

module.exports = function (queryString, callback) {
  var options;
  queryString = queryString || '?access_token=16741082.1b07669.121a338d0cbe4ff6a5e04543158a4f82';
  options = {
    host:     'api.instagram.com',
    method:   'GET',
    keepAlive: true,
    path:      '/v1/tags/crookedspaces/media/recent' + queryString
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

      obj.data.forEach(function (imgData) {
        returnObj.images.push({
          timestamp: new Date(parseInt(imgData.created_time, 10)).getTime(),
          user: {
            name: imgData.user.username,
            avatar: imgData.user.profile_picture,
          },
          image_url: imgData.images.standard_resolution.url,
          orientation: 'square'
        });
      });

      return callback(returnObj);
    });
  });
};
