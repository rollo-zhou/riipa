/**
 * Created by jiey on 2014/11/10.
 */
define(['jquery', 'pageView', '../../config/config'], function ($, PageView, config) {
    var HotelStayingView = PageView.extend({
        events: {
            'click #calender-go-back': 'goBack'
        },
        goBack: function () {
            this.trigger('animHide');
        }
    });

    return HotelStayingView;
});