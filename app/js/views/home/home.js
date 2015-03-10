/**
 * Created by jiey on 2014/11/4.
 */
define(['jquery', 'underscore', 'pageView'], function ($, _, PageView) {
    var HomeRootView = PageView.extend({
        _TOGGLE_FLAG: false,
        initialize: function () {
            this.renderAll();

        },
        renderAll: function () {
            this.loadHotelView();
            this.loadSlideNavView();
            this.loadFlightView();
        },
        render: function () {
            return this;
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
            'tap @ui.toggleMenuBtn': 'toggleMenu',
            'tap @ui.overlaySide': 'toggleMenu',
            'tap @ui.homePageTab li': 'switchPageTab'
        },
        loadHotelView: function () {
            var self = this;
            require(['views/home/hotel'], function (HotelView) {
                self.addChildView('hotelView', new HotelView({
                    parentView: self,
                    el: '.hotels_home'
                }));
            });
        },
        loadFlightView: function () {
            var self = this;
            require(['views/home/flight'], function (FlightView) {
                self.addChildView('flightView', new FlightView({
                    parentView: self,
                    el: '.flight_home'
                }));
            });
        },
        loadSlideNavView: function () {
            var self = this;
            require(['views/home/slide-nav'], function (SlideNavView) {
                self.addChildView('slideNavView', new SlideNavView({
                    parentView: self,
                    el: '.slide_nav'
                }));
            });
        },
        toggleMenu: function (event) {
            console.log('toggle');
            this.animToggleMenu();
            this.childViews.slideNavView.trigger('toggle');
        },
        animToggleMenu: function () {
            if (this._TOGGLE_FLAG) {
                this.hideOverlaySide();

                this.$el.css({
                    marginLeft: '0%'
                });

                this._TOGGLE_FLAG = false;
            } else {
                this.showOverlaySide();

                this.$el.css({
                    marginLeft: '80%'
                });

                this._TOGGLE_FLAG = true;
            }
        },
        showOverlaySide: function () {
            this.ui.overlaySide.show();
        },
        hideOverlaySide: function () {
            this.ui.overlaySide.hide();
        },
        switchPageTab: function (event) {
            var $item = $(event.currentTarget);

            if ($item.hasClass('cur') || (this.childViews.hotelView.isAnimated() && this.childViews.flightView.isAnimated())) {
                return false;
            }
            $item.addClass('cur').siblings().removeClass('cur');
            //console.log('li', event)
            if ($item.find('i').hasClass('hotels_ico')) {
                this.childViews.hotelView.animShow();
                this.childViews.flightView.animHide();
            } else if ($item.find('i').hasClass('flight_ico')) {
                this.childViews.hotelView.animHide();
                this.childViews.flightView.animShow();
            }
        }
    });

    return HomeRootView;
});