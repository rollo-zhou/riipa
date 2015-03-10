/**
 * Created by jiey on 2014/11/11.
 */
define(['jquery', 'pageView', '../../config/config'], function ($, PageView, config) {

    var CurrencyView = PageView.extend({
        _STATE_TAG: false,
        initialize: function (opts) {

        },
        ui: {

        },
        events: {
            'click .head_back': 'goBack',
            'click .choose_action': 'chooseAction',
            'click .choose_list li': 'chooseLanguge'
        },
        goBack: function () {
            this.trigger('animHide');
        },
        chooseAction: function () {
            this.goBack();
        },
        chooseLanguge: function (event) {
            var self = this,
                $this = $(event.currentTarget),
                ACTIVE_CLASS_NAME = 'active',
                countryClass = $this.find('i').attr('class');
            if ($this.hasClass(ACTIVE_CLASS_NAME)) return false;
            $this.addClass(ACTIVE_CLASS_NAME).siblings().removeClass(ACTIVE_CLASS_NAME);


        },
        render: function () {

        }
    });
    return  CurrencyView;
});