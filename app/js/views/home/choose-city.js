/**
 * Created by jiey on 2014/11/10.
 */
define(['jquery', 'pageView', '../../config/config'], function ($, PageView, config) {

    var ChooseCityView = PageView.extend({
        _STATE_TAG: false,
        _CHOOSE_CITY_INFO: '',
        initialize: function (opts) {

        },
        ui: {
            'clearCityBtn': 'clear-city-btn'
        },
        events: {
            'click #cancel-choose-city-btn': 'cancelChooseCity',
            'click @ui.clearCityBtn': 'clearCityInput',
            'click dl li': 'chooseCityItem'
        },
        cancelChooseCity: function () {
            this.trigger('animHide');
            //console.log(this.__childrenViews);
            //this.removeFromParent();
        },
        clearCityInput: function () {

        },
        chooseCityItem: function (event) {
            var self = this,
                $this = $(event.currentTarget),
                cityModel = {};
            cityModel.cityname = $this.attr('cityname');
            cityModel.cityenname = $this.attr('cityenname');
            cityModel.cityid = $this.attr('cityid');
            cityModel.note = $this.attr('note');

            this.parentView.trigger('city', cityModel);

            this.trigger('animHide');
        },
        render: function () {

        }
    });
    return  ChooseCityView;
});