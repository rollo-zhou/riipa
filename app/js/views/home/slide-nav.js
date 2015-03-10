/**
 * Created by jiey on 2014/11/6.
 */
define(['jquery', 'pageView', '../../config/config'], function ($, PageView, config) {
    var LANGUAGE_CLASS = config.COUNTRY_CLASS_NAME;

    var SlideNavView = PageView.extend({
        _TOGGLE_TAG: false,
        initialize: function () {
            var self = this;

            this.on('toggle', function () {
                this.toggleBody();
            });

            this.on('languageViewShow', function () {
                this.languageView && this.languageView.trigger('animShow');
            });

            this.on('languageViewHide', function () {
                this.languageView && this.languageView.trigger('animHide');
            });

            this.on('language', function (languageKey) {
                this.updateLanguageIcon(languageKey);
            });

            this.loadLanguageView();
            this.loadCurrencyView();
        },
        ui: {
            languageIcon: '#set-language .current'
        },
        events: {
            'click #set-language': 'setLanguage',
            'click #set-currency': 'setCurrency'
        },
        render: function () {

        },
        setLanguage: function () {
            this.trigger('languageViewShow');
        },
        setCurrency: function () {
            this.currencyView.trigger('animShow');
        },
        updateLanguageIcon: function (languageKey) {
            var className = LANGUAGE_CLASS[languageKey];
            this.ui.languageIcon.html('<i class="ico_country ' + className +'"></i> ' + languageKey);
        },
        toggleBody: function () {
            if (this._TOGGLE_FLAG) {
                this.$el.css({
                    marginLeft: '-100%'});
                    this._TOGGLE_FLAG = false;

            } else {
                this.$el.css({
                    marginLeft: '0%'});
                    this._TOGGLE_FLAG = true;

            }
        },
        loadLanguageView: function () {
            self = this;
            require(['views/home/language'], function (LanguageView) {
                self.languageView = new LanguageView({
                   parentView: self,
                   el: '#language-page'
                });
            });
        },
        loadCurrencyView: function () {
            self = this;
            require(['views/home/currency'], function (CurrencyView) {
                self.currencyView = new CurrencyView({
                    parentView: self,
                    el: '#currency-page'
                });
            });
        }
    });
    return  SlideNavView;
});