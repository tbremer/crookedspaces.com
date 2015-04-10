'use strict';

var http = require('http'),
    chalk = require('chalk'),
    checkRoutes = require('./lib/check-routes'),
    server = http.createServer,
    routes = [
      '/',
      '/instagram',
      '/twitter',
      '/space/(?:[0-9]+)'
    ],
    routes2 = {
      '/': 123,
      '/instagram': 456,
      '/twitter': 789,
      '/space/(?:[0-9]+)': '0-='
    };

server(function (req, res) {
  var validRoute = checkRoutes(req.url, routes2),
      header = {
        code: ((validRoute) ? 200 : 404),
        content: 'text/plain',
      };

  res.writeHead(header.code, {
    'Content-Type': header.content
  });

  if (!validRoute) {
    return res.end('404');
  }

  return res.end(req.url);


}).listen(1111, function () {
  console.log("listening…")
});
