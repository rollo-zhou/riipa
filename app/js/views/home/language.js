/**
 * Created by jiey on 2014/11/7.
 */
define(['jquery', 'pageView', '../../config/config'], function($, PageView, config) {
    var LANGUAGE_CLASS = config.COUNTRY_CLASS_NAME;


    var LanguageView = PageView.extend({
        _STATE_TAG: false,
        _LANGUAGE_KEY: '',
        initialize: function(opts) {

        },
        ui: {

        },
        events: {
            'click .head_back': 'goBack',
            'click .choose_action': 'chooseAction',
            'click .choose_list li': 'chooseLanguge'
        },
        goBack: function() {
            this.trigger('animHide');
        },
        chooseAction: function() {
            this.goBack();
            this.parentView.trigger('language', this._LANGUAGE_KEY);
        },
        chooseLanguge: function(event) {
            var self = this,
                $this = $(event.currentTarget),
                ACTIVE_CLASS_NAME = 'active',
                countryClass = $this.find('i').attr('class');
            if ($this.hasClass(ACTIVE_CLASS_NAME)) return false;
            $this.addClass(ACTIVE_CLASS_NAME).siblings().removeClass(ACTIVE_CLASS_NAME);

            _.each(LANGUAGE_CLASS, function(value, key) {

                if (new RegExp(value).test(countryClass)) {
                    console.log(key);
                    self._LANGUAGE_KEY = key;
                }
            });
        },
        render: function() {

        }
    });
    return LanguageView;
});
