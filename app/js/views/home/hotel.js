
define(['jquery', 'pageView'], function($, PageView) {
  var HotelView = PageView.extend({
    el: "#hotelsDiv",
    initialize: function() {

      this.on('city', function(cityModel) {
        this.updateCity(cityModel);
      });


    },
    ui: {
      'searchCityBtn': '.search_locate',
      'searchHotelNameBtn': '.search_name',
      'checkinBtn': '.checkin',
      'checkoutBtn': '.checkout'
    },
    events: {
      'click .hotel_nearby': 'searchNearBy',
      'click @ui.searchCityBtn': 'showChooseCity',
      'click @ui.searchHotelNameBtn': 'showChooseHotelName',
      'click @ui.checkinBtn': 'chooseCheckin',
      'click @ui.checkoutBtn': 'chooseCheckout'
    },
    render: function() {
      this.loadChooseCityView();
      this.loadChooseHoleNameView();
      this.loadHotelStayingView();
    },
    eventsCallBack: {
      showChooseCity: function() {
        this.childViews.chooseCityView.trigger('animShow');
      },
      showChooseHotelName: function() {

        this.chooseHotelNameView.trigger('animShow');
      },
      searchNearBy: function() {
        console.log('nearby');
        geolocation.checkIsChina();
        //var loading = new Loading().show();
      },
      chooseCheckin: function() {
        this.chooseHotelStaying.trigger('animShow');
      },
      chooseCheckout: function() {
        this.chooseHotelStaying.trigger('animShow');
      }
    },
    updateCity: function(cityModel) {
      this.ui.searchCityBtn.find('strong').html(cityModel.cityname);
    },
    loadChooseCityView: function() {
      var self = this;
      require(['views/home/choose-city'], function(ChooseCityView) {
        self.addChildView('chooseCityView', new ChooseCityView({
          hasFullPage: true,
          parentView: self,
          el: '#choose-hotel-city-page'
        }));
      });
    },
    loadChooseHoleNameView: function() {
      var self = this;
      require(['views/home/choose-hotel-name'], function(ChooseHotelNameView) {
        self.chooseHotelNameView = new ChooseHotelNameView({
          hasFullPage: true,
          parentView: self,
          el: '#choose-hotel-name-page'
        });

      });
    },
    loadHotelStayingView: function() {
      var self = this;
      require(['views/home/choose-hotel-staying'], function(HotelStayingView) {
        self.chooseHotelStaying = new HotelStayingView({
          hasFullPage: true,
          parentView: self,
          el: '#choose-hotel-checkin-page'
        });

      });
    },

  });
  return HotelView;
});
