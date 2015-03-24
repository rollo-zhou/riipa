
define(['jquery', 'pageView'], function($, PageView) {
  var ChooseAirportView = PageView.extend({
    el:"#Index_ChooseAirport_From",
    ui:{
      "selectAddress":"#selectAddress"
    },
    viewModle:{
      data:{},
      callback:function () {}
    },
    events: {
      'click @ui.selectAddress>li': 'selectAddress'
    },
    eventsCallBack: {
      selectAddress:function (event) {
        var target=$(event.currentTarget);
        this.parentView.parentView.$el.show();
        this.$el.hide();
        this.viewModle.data={
          cityname:target.attr("cityname"),
          cityenname:target.attr("cityennametarget"),
          citycode:target.attr("citycode"),
          airportcode:target.attr("airportcode"),
          airportname:target.attr("airportname"),
          country:target.attr("country"),
          isinternation:target.attr("isinternation")
        };
        //this.parentView.trigger("flightAddressFrom");
        this.viewModle.callback.call(this.parentView,this.viewModle.data);
      }
    },
    initialize:function (options) {
      //this.viewModle.source=options.source;
    }
  });

  return ChooseAirportView;
});
