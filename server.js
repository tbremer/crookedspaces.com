var http = require('http'),
    getSecure = require('https').get,
    chalk = require('chalk'),
    checkRoutes = require('./lib/check-routes'),
    instagram = require('./lib/Routes/instagram'),
    twitter = require('./lib/Routes/twitter'),
    home = require('./lib/Routes/home'),
    server = http.createServer,
    routes = {
      '/': home,
      '/instagram': instagram,
      '/twitter': twitter,
      '/space/(?:[0-9]+)': 'space'
    };

server(function (req, res) {
  var url_parts = req.url.split(/\?(.+)?/),
      url = url_parts[0],
      query = url_parts[1] || '',
      validRoute = checkRoutes(url, routes),
      header = {
        code: ((validRoute) ? 200 : 404),
        content: 'text/plain',
      },
      data;

  res.writeHead(header.code, {
    'Content-Type': header.content
  });

  if (!validRoute) {
    return res.end('404');
  }

  routes[validRoute](null, function (data) {
    return res.end(data);
  });
}).listen(1111, function () {
  console.log("listening…")
});
