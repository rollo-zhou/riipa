
define(['jquery', 'pageView', 'views/home/flight', 'views/home/hotel', 'views/home/slidenav'], function($, PageView, flight, hotel, slideNav) {
  var HomeRootView = PageView.extend({
    el: "#home-index",
    template: "",
    config: {
      ui: "",
      url: "",
      tips: "",
      variable: "",
      Parameters: ""
    },
    ui: {
      'overlaySide': '.overlay_slide',
      'slideNavView': '.slide_nav',
      'hotelView': '.hotels_home',
      'flightView': '.flight_home',
      'toggleMenuBtn': '.head_bt',
      'homePageTab': '.page_tab'
    },
    events: {
      'click @ui.toggleMenuBtn': 'toggleMenu',
      'click @ui.overlaySide': 'toggleMenu',
      'click @ui.homePageTab li': 'switchPageTab'
    },
    widget: {
      "name1": "name1"
    },
    itemView: {
      'hotelView': hotel,
      'flightView': flight,
      'slideNavView': slideNav
    },
    viewModle:{

    },
    widgetCallBack: {
      name1: function() {
        return 1;
      }
    },
    eventsCallBack: {
      toggleMenu: function(event) {
        this.itemView.slideNavView.$el.css({
          "-webkit-transform": this.itemView.slideNavView.$el.css("-webkit-transform")=="translateX(-100%)"?"translateX(0%)":'translateX(-100%)'
        });
        this.$el.css({
          "-webkit-transform": this.itemView.slideNavView.$el.css("-webkit-transform")=="translateX(-100%)"?"translateX(0%)":'translateX(80%)'
        });
      },
      switchPageTab: function(event) {
        var $item = $(event.currentTarget);
        if ($item.hasClass('cur')) {
          return false;
        }
        $item.addClass('cur').siblings().removeClass('cur');
        if ($item.find('i').hasClass('hotels_ico')) {
          this.itemView.hotelView.$el.show();
          this.itemView.flightView.$el.hide();
        } else if ($item.find('i').hasClass('flight_ico')) {
          this.itemView.hotelView.$el.hide();
          this.itemView.flightView.$el.show();
        }
      }
    },
    listenToCallBack: {

    },
    listenTo: function() {

    },
    render: function() {
      return this;
    },
    initialize: function() {

    }
  });
  return HomeRootView;
});
