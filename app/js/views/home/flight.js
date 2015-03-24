define(['jquery', 'pageView', 'views/home/flight.airport', 'views/home/flight.date','widget/m/calendar'], function($, PageView, airport, date,calendar) {
  var FlightView = PageView.extend({
    el: "#flightsDiv",
    ui: {
      flightRoundTrip: '#flightRoundTrip',
      flightOneWay: "#flightOneWay",
      flightAddressFrom: "#flightIndex-flightAddressFrom",
      flightAddressTo: "#flightIndex-flightAddressTo",
      flightDateDepart: "#flightDateDepart",
      flightDateRound: "#flightDateRound",
      flightindexclass: "#flightindexclass",
      flightSearch: "#flightSearch",
      calendar:"#Index_Calendar_Depart !",
      checkoutdate:"#dtime",
      checkindate:"#atime",
      //checkin:"#choosehotelcheckinpanel"
    },
    events: {
      'click @ui.flightRoundTrip': 'flightRoundTrip',
      'click @ui.flightOneWay': 'flightOneWay',
      'click @ui.flightAddressFrom': 'flightAddressFrom',
      'click @ui.flightAddressTo': 'flightAddressTo',
      'click @ui.flightDateDepart': 'flightDateDepart',
      'click @ui.flightDateRound': 'flightDateRound',
      'click @ui.flightindexclass': 'flightindexclass',
      'click @ui.flightSearch': 'flightSearch'
    },
    itemView: {
      'airport': airport,
      //'airportTo': {view:airport,options:{source:"to"}},
      //'checkIn': date,
      // 'checkOut': {view:date,options:{source:"out"}},
    },
    viewModle: {
      user: {
        oneWayOrRoundTrip: 1,
        from: "",
        to: "",
        depart: "",
        retur: "",
        clas: ""
      },
      calendar:{}
    },
    widget: {
      "calendar": "calendar"
    },
    widgetCallBack: {
      calendar: function() {
        var that=this;
        new calendar({
          beforCallback: function() {
            that.ui.calendar.show();
            that.parentView.$el.hide();
          },
          callback: function(data) {
            that.ui.calendar.hide();
            that.parentView.$el.show();
            that.viewModle.calendar.callback.call(that,data);
          },
          dWrap:this.ui.calendar,
          unInitCallback:true,
          dStartInput: this.ui.flightDateDepart,
          dBackInput: this.ui.flightDateRound,
          sStartTitle: "start",
          sBackTitle: "end",
          fromFlights: 1,
          titelClassName: "head_bt head_back",
          monthRange: 12
        });
      }
    },
    eventsCallBack: {
      flightRoundTrip: function(event) {
        var target = $(event.currentTarget);
        if (target.hasClass('cur')) return;
        target.attr("class", "cur").siblings().removeClass();
        this.ui.flightDateRound.show();
        this.viewModle.oneWayOrRoundTrip = 2;
      },
      flightOneWay: function(event) {
        var target = $(event.currentTarget);
        if (target.hasClass('cur')) return;
        target.attr("class", "cur").siblings().removeClass();
        this.ui.flightDateRound.hide();
        this.viewModle.oneWayOrRoundTrip = 1;
      },
      flightAddressFrom: function() {
        this.parentView.$el.hide();
        this.itemView.airport.$el.show();
        this.itemView.airport.viewModle.callback = this.listenToCallBack.flightAddressFrom;
      },
      flightAddressTo: function(event) {
        this.parentView.$el.hide();
        this.itemView.airport.$el.show();
        this.itemView.airport.viewModle.callback = this.listenToCallBack.flightAddressTo;
      },
      flightDateDepart: function() {
        this.viewModle.calendar.callback=this.listenToCallBack.flightDateDepart;
      },
      flightDateRound: function() {
        this.viewModle.calendar.callback=this.listenToCallBack.flightDateRound;
      },
      flightindexclass: function(event) {

      },
      flightSearch: function() {

      },
    },
    listenToCallBack: {
      flightAddressFrom: function(data) {
        this.ui.flightAddressFrom.find('span').html(data.cityname);
        this.viewModle.user.from = data.cityname;
      },
      flightAddressTo: function(data) {
        this.ui.flightAddressTo.find('span').html(data.cityname);
        this.viewModle.user.to = data.cityname;
      },
      flightDateDepart: function(data) {
        this.ui.checkoutdate.html(data.start.full);
      },
      flightDateRound: function(data) {
        this.ui.checkindate.html(data.back.full);
      },
    },
    listen: function() {
      // this.on("flightAddressFrom",this.listenToCallBack.flightAddressFrom);
      // this.on("flightAddressTo",this.listenToCallBack.flightAddressTo);
      // this.on("flightDateDepart",this.listenToCallBack.flightDateDepart);
      // this.on("flightDateRound",this.listenToCallBack.flightDateRound);
    },
    initialize: function() {
      this.listen();
    },
    render: function() {

    },

  });
  return FlightView;
});
