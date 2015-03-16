(function() {
  var app = {
    paths: {
      "home": "views/home/home",
      "zepto": "vendor/zepto/zepto.min",
      "jquery": "vendor/zepto/zepto.min",
      "underscore": "vendor/underscore/underscore-min",
      "domReady": "/framework/js/helper/3rd/domReady",
      "router": "/framework/js/core/router/router",
      "views":"/framework/js/core/view/view",
      "pageView":"core/pageView/pageView",

    },
    routes: {
      "/index.html": "home",
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
        R.bindRoutes(app.routes,function (viewName) {
          require([viewName],function(view) {
            new view();
          });
        });
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
