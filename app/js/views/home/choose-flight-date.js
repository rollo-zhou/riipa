/**
 * Created by jiey on 2014/11/11.
 */
define(['jquery', 'pageView', '../../config/config'], function ($, PageView, config) {
    var ChooseFlightDateView = PageView.extend({
        events: {
            'click .head_back': 'goBack'
        },
        goBack: function () {
            this.trigger('animHide');
        }
    });

    return ChooseFlightDateView;
});