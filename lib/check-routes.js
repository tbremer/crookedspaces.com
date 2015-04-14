'use strict';

var escapeSlashes = require('./escape-slashes'),
    testRoutes = function (request, routes) {
      var route, reg, returnObj;

      for (route in routes) {
        reg = new RegExp('^' + escapeSlashes(route) + '$');
        if (reg.test(request) === false) {
          continue;
        }

        returnObj = routes[route];

        if (typeof returnObj === 'function') {
          returnObj = {
            content_type: 'text/html',
            action: routes[route]
          };
        }

        if (/\/api\//.test(route) === true) {
          returnObj.content_type = 'application/json';
        }

        return returnObj;
      }

      return false;
    };

module.exports = function (request, routes) {
  if ((request === undefined) || (routes === undefined || routes.length === 0)) {
    return false;
  }

  return testRoutes(request, routes);
};
