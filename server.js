var http = require('http'),
    getSecure = require('https').get,
    fs = require('fs'),
    Handlebars = require('handlebars'),
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
    },
    templates = {
      home: fs.readFileSync(__dirname + '/lib/templates/home.hbs', {encoding: 'utf-8'}),
      end: fs.readFileSync(__dirname + '/lib/templates/end-of-dom.hbs', {encoding: 'utf-8'})
    };

server(function (req, res) {
  var url_parts = req.url.split(/\?(.+)?/),
      url = url_parts[0],
      query = url_parts[1] || '',
      validRoute = checkRoutes(url, routes),
      header = {
        code: ((validRoute) ? 200 : 404),
        content: 'text/html',
      },
      data, template, html;

  res.writeHead(header.code, {
    'Content-Type': header.content
  });

  if (!validRoute) {
    return res.end('404');
  }

  res.write(templates.home);

  routes[validRoute](null, function (data) {
    if (data.write) {
      data.write.forEach(function (el) {
        if (typeof el !== 'string') {
          // handle if it's not a string
        }

        res.write(el);
      });
      delete data.write;
    }

    if (data.display_write_end === true) {
      return res.end(JSON.stringify(data));
    }
    template = Handlebars.compile(templates.end);
    html = template();

    return res.end(html);
  });
}).listen(1111, function () {
  console.log("listening…");
});
