'use strict';

var escapeSlashes = require('./escape-slashes'),
    testRoutes = function (request, routes, i) {
      i = i || 0;

      if (routes.length === i) {
        return false;
      }

      var reg = new RegExp('^' + escapeSlashes(routes[i]) + '$');
      if (reg.test(request) === true) {
        return routes[i];
      }
      return testRoutes(request, routes, ++i);
    };

module.exports = function (request, routes) {
  if ((request === undefined) || (routes === undefined || routes.length === 0)) {
    return false;
  }

  if (routes.constructor === Array) {
    return testRoutes(request, routes);
  }

  var newRoutes = [], key;
  for (key in routes) {
    newRoutes.push(key);
  }

  return testRoutes(request, newRoutes);
}
