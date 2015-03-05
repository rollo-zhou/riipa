(function() {
  var app = {
    paths: {
      "home": "views/home/index",
      "zepto": "vendor/zepto/zepto.min.js",
      "underscore": "vendor/underscore/underscore-min",
      "domReady": "libs/3rd/domReady",
      "router": "helper/router"
    },
    routes: {
      "": "home",
      "/hotels/list/:citynahtmlme-hotels-list-:cityid": "hotels.list"
    },
    shim: {
      'zepto': {
        exports: '$'
      },
    },
    urlArgs: "releaseno=",
    baseUrl: "js/",
    domReady: function() {
      require(['domReady', "router"], function(D, R) {
        R.bindRoutes(app.routes);
        D(function() {
          R.loadUrl();
        });
      });
    }
  };

  require.config({
    waitSeconds: 120,
    urlArgs: app.urlArgs,
    baseUrl: app.baseUrl,
    paths: app.paths,
    shim: app.shim,
    callback: app.domReady
  });
})();
