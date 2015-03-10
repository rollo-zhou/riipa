/**
 * Created by jiey on 2014/11/6.
 */
define(['jquery', 'pageView'], function ($, PageView) {
    var Flight

    var FlightView = PageView.extend({
        _ANIM_FLAG: false,
        initialize: function () {
            this.render();
        },
        ui: {
            fltDeparture: '#flt-departure',
            fltDepartureName: '#flt-departure strong',
            fltDepartureDesName: '#flt-departure span',
            fltArrive: '#flt-arrive',
            fltArriveName: '#flt-arrive strong',
            fltArriveDesName: '#flt-arrive span',
            fltDepartDate: '#flt-depart-date',
            fltArriveDate: '#flt-arrive-date'
        },
        events: {
            'click .tab_flt li': 'switchFltTab',
            'click .cutover_area': 'switchChooseFltDate',
            'click @ui.fltDeparture': 'showChooseAirportDepartView',
            'click @ui.fltArrive': 'showChooseAirportArriveView',
            'click @ui.fltDepartDate': 'showChooseFlightDateView',
            'click @ui.fltArriveDate': 'showChooseFlightDateView'
        },
        render: function () {
            this.loadChooseAirportDepartView();
            this.loadChooseAirportArriveView();
            this.loadChooseFlightDateView();
        },
        loadChooseAirportDepartView: function () {
            var self = this;
            require(['views/home/choose-airport-depart'], function (ChooseAirportDepartView) {
                self.addChildView('chooseAirportDepartView', new ChooseAirportDepartView({
                    hasFullPage: true,
                    parentView: self,
                    el: '#choose-airport-depart'
                }));

            });
        },
        loadChooseAirportArriveView: function () {
            var self = this;
            require(['views/home/choose-airport-arrive'], function (ChooseAirportArriveView) {
                self.addChildView('chooseAirportArriveView', new ChooseAirportArriveView({
                    hasFullPage: true,
                    parentView: self,
                    el: '#choose-airport-arrive'
                }));

            });
        },
        showChooseAirportDepartView: function () {
            this.childViews.chooseAirportDepartView.trigger('animShow');
        },
        showChooseAirportArriveView: function () {
            this.childViews.chooseAirportArriveView.trigger('animShow');
        },
        showChooseFlightDateView: function () {
            this.childViews.chooseFlightDateView.trigger('animShow');
        },
        loadChooseFlightDateView: function () {
            var self = this;
            require(['views/home/choose-flight-date'], function (ChooseFlightDateView) {
                self.addChildView('chooseFlightDateView', new ChooseFlightDateView({
                    hasFullPage: true,
                    parentView: self,
                    el: '#choose-flight-date'
                }));

            });
        },
        switchFltTab: function (event) {
            var $this = $(event.currentTarget),
                CUR_FLAG = 'cur',
                itemValue = $this.data('value');
            if ($this.hasClass(CUR_FLAG)) {
                return false;
            }
            var DATE_CLASS_NAME = {
                round: {
                    depart: 'date_oneway_two',
                    arrive: 'date_round_show'
                },
                one: {
                    depart: 'date_oneway',
                    arrive: 'date_round'
                }
            };

            switch (itemValue) {
                case 'round':
                    this.ui.fltDepartDate.addClass(DATE_CLASS_NAME.round.depart).removeClass(DATE_CLASS_NAME.one.depart);
                    this.ui.fltArriveDate.addClass(DATE_CLASS_NAME.round.arrive).removeClass(DATE_CLASS_NAME.one.arrive);
                    break;
                case 'one':
                    this.ui.fltDepartDate.addClass(DATE_CLASS_NAME.one.depart).removeClass(DATE_CLASS_NAME.round.depart);
                    this.ui.fltArriveDate.addClass(DATE_CLASS_NAME.one.arrive).removeClass(DATE_CLASS_NAME.round.arrive);
                    break;
                default:
            }
            $this.addClass(CUR_FLAG).siblings().removeClass(CUR_FLAG);
        },
        switchChooseFltDate: function () {
            this.clacuFltDate();
        },
        clacuFltDate: function () {
            this.ui.fltDeparture.css({
                position: 'absolute',
                overflow: 'visible'
            });
            this.ui.fltArrive.css({
                position: 'relative',
                overflow: 'visible'
            });
            this.ui.fltArriveName.css({
                float: 'right'
            });
            this.ui.fltArriveDesName.css({
                position: 'relative',
                float: 'right'
            });
            this.animFltDate();
        },
        animFltDate: function () {
            var self = this,
                ANIM_RANGE = $(window).width() / 2;
            this.ui.fltDepartureName.animate({
                marginLeft: ANIM_RANGE
            }, 400, function () {
                self.ui.fltDepartureName.removeAttr('style');
            });
            this.ui.fltDepartureDesName.animate({
                marginLeft: ANIM_RANGE

            }, 400, function () {
                self.ui.fltDepartureDesName.removeAttr('style');
                self.ui.fltDeparture.removeAttr('style');
            });
            this.ui.fltArriveName.animate({
                marginRight: ANIM_RANGE
            }, 400, function () {
                self.ui.fltArriveName.removeAttr('style');
            });
            this.ui.fltArriveDesName.animate({
                marginRight: ANIM_RANGE
            }, 400, function () {
                self.ui.fltArriveDesName.removeAttr('style');
                self.ui.fltArrive.removeAttr('style');
                self.switchFltTabText();
            });
        },
        switchFltTabText: function () {
            var fltDepartureName = this.ui.fltDepartureName.text();
            var fltDepartureDesName = this.ui.fltDepartureDesName.text();
            var fltArriveName = this.ui.fltArriveName.text();
            var fltArriveDesName = this.ui.fltArriveDesName.text();
            this.ui.fltDepartureName.text(fltArriveName);
            this.ui.fltDepartureDesName.text(fltArriveDesName);
            this.ui.fltArriveName.text(fltDepartureName);
            this.ui.fltArriveDesName.text(fltDepartureDesName);
        }
    });
    return  FlightView;
});