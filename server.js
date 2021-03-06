'use strict';

var http = require('http'),
    fs = require('fs'),
    Handlebars = require('handlebars'),
    checkRoutes = require('./lib/check-routes'),
    home = require('./lib/routes/home'),
    static_files = require('./lib/static-files'),
    api = {
      // vote: require('./lib/routes/api/vote'),
      nexturls: require('./lib/routes/nexturls')
    },
    server = http.createServer,
    port = process.env.PORT || 1111,
    routes = {
      '/': home,
      '/assets/(?:.+)?': {
        content_type: '*',
        action: static_files
      },
      '/space/(?:[0-9]+)': 'space',
      '/api/nexturls': api.nexturls
      // '/api/vote': api.vote
    },
    templates = {
      head: fs.readFileSync(__dirname + '/lib/templates/head-of-dom.hbs', {encoding: 'utf-8'}),
      end: fs.readFileSync(__dirname + '/lib/templates/end-of-dom.hbs', {encoding: 'utf-8'})
    };

server(function (req, res) {
  var url_parts = req.url.split(/\?(.+)?/),
      url = url_parts[0],
      query = url_parts[1] || '',
      valid_route = checkRoutes(url, routes),
      header = {
        code: ((valid_route) ? 200 : 404),
        content: valid_route.content_type,
      },
      data;

  res.writeHead(header.code, {
    'Content-Type': header.content
  });

  if (!valid_route) {
    return res.end('404');
  }

  if (valid_route.content_type === 'text/html') {
    res.write(templates.head);
  }

  valid_route.action({res: res, query: query, url: url}, function (err, data) {
    data = data || templates.end;

    if (err) {
      throw new Error(err);
    }

    if (data.constructor === Object && valid_route.content_type === 'application/json') {
     res.end(JSON.stringify(data));
    }

    res.end(data);
  });

}).listen(port, function () {
  console.log("Listening… on port %s", port);
});
