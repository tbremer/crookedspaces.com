var get = require('https').get;

module.exports = function (url, callback) {
  url = url || 'https://api.instagram.com/v1/tags/crookedspaces/media/recent?access_token=16741082.1b07669.121a338d0cbe4ff6a5e04543158a4f82';

  get(url, function (res) {
    var obj = '';

    res.on('data', function (data) {
      obj += data;
    });

    res.on('end', function () {
      obj = JSON.parse(obj);

      var returnObj = {
        next_url: obj.pagination.next_url,
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
