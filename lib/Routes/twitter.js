var TwitterAPI = require('twitter');

module.exports = function (i, callback) {
  var client = new TwitterAPI({
        consumer_key: 'uEU8sAilM1YyybykPIIUqxLxC',
        consumer_secret: 'WKM3Gbt1Yru60bWttfjGzJSDM3Vb7SOElEyQI5HKbOnAl7Slj9',
        access_token_key: '12135872-JJESTLcDPh0NstuQK50snKbUhWafw1c5zUEeYRjEC',
        access_token_secret: 'RCyuyUXVE9RMeLtJY1LdFkwN93xJ5JKTZE2GDDeUzCae4'
      }),
      params = {q: '#crookedspaces+filter:images'};

  client.get('search/tweets', params, function (err, tweets) {
    if (err) {
      return '{}';
    }

    var returnObj = {
      next_url: tweets.search_metadata.refresh_url,
      tweets: []
    };

    tweets.statuses.forEach(function (el) {
      returnObj.tweets.push({
        timestamp: new Date(el.created_at).getTime(),
        user: el.user.screen_name,
        image_url: el.entities.media[0].media_url,
        orientation: ((el.entities.media[0].sizes.small.w === el.entities.media[0].sizes.small.h) ? 'square' : ((el.entities.media[0].sizes.small.w > el.entities.media[0].sizes.small.h) ? 'horizontal' : 'vertical'))
      });
    });

    return callback(returnObj);
  });
}
