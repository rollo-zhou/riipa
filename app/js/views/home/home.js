/**
 * Created by jiey on 2014/11/4.
 */
define(['jquery', 'underscore', 'pageView', 'views/home/flight', 'views/home/hotel', 'views/home/slide-nav'], function($, _, PageView, flight, hotel, slideNav) {
    var HomeRootView = PageView.extend({
            initialize: function() {
                this.renderAll();
            },
            render: function() {
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
            itemView: {
                'hotelView': hotel,
                'flightView': flight,
                'slideNavView': slideNav
            },
            eventsCallBack: {
                toggleMenu: function(event) {
                    console.log('toggle');
                    this.animToggleMenu();
                    this.childViews.slideNavView.trigger('toggle');
                },
                showOverlaySide: function() {
                    this.ui.overlaySide.show();
                },
                hideOverlaySide: function() {
                    this.ui.overlaySide.hide();
                },
                switchPageTab: function(event) {
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
            },
    });
    return HomeRootView;
});
