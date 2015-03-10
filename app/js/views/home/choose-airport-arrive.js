/**
 * Created by jiey on 2014/11/11.
 */
define(['jquery', 'pageView', '../../config/config'], function ($, PageView, config) {
    var ChooseAirportArriveView = PageView.extend({
        events: {
            'click .cancel': 'goBack'
        },
        goBack: function () {
            this.trigger('animHide');
        }
    });

    return ChooseAirportArriveView;
});