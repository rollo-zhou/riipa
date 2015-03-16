/**
 * Router v0.1
 * 修改于Backbone 1.1.2。
 */

define(["underscore"], function() {

  var optionalParam = /\((.*?)\)/g,
    namedParam = /(\(\?)?:\w+/g,
    splatParam = /\*\w+/g,
    escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g,
    // Cached regex for removing a trailing slash.
    routeStripper = /^[#\/]|\s+$/g,
    // Cached regex for removing a trailing slash.
    trailingSlash = /\/$/,
    handlers = [],

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    routeToRegExp = function(route) {
      route = route.replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, function(match, optional) {
          return optional ? match : '([^/?]+)';
        })
        .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    extractParameters = function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment = function(fragment, forcePushState) {
      if (fragment == null) {
        fragment = decodeURI(this.location.pathname + this.location.search);
        fragment = fragment.replace(trailingSlash, '');
      }
      return fragment;
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl = function(fragment) {
      fragment = fragment = getFragment(fragment);
      var handler=_.find(handlers, function(handler) {
        return handler.route.test(fragment);
      });
      handler&&handler.callback(fragment);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    bindRoutes = function(routes,callback) {
      if (!routes) return;
      //routes = _.result(this, 'routes');
      var route, routesKeys = _.keys(routes);
      while ((route = routesKeys.pop()) != null) {
        routeHandlers(route, routes[route],callback);
      }
    },

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    routeHandlers = function(route, name,callback) {
      if (!_.isRegExp(route)) route = routeToRegExp(route);
      //var router = this;
      addRouteHandlers(route, function () {
        callback(name);
      });
      return this;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    addRouteHandlers = function(route, callback) {
      handlers.unshift({
        route: route,
        callback: callback
      });
    };

  return {
    bindRoutes: bindRoutes,
    loadUrl: loadUrl
  };
});
