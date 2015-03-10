/**
 * Created by jiey on 2014/11/10.
 */
define(['pageView', 'model', '../../config/config'], function (PageView, Model, config) {
    var HotelNameModel = Model.extend({

    });

    var ChooseHotelNameView = PageView.extend({
        hotelNameTemplate: _.template('<% _.each(SearchResult, function (value, index) { %> <li data-hotel-name="<%=value.HotelName %>" data-hotel-id="<%=value.HotelID %>"><a><%=value.HotelName %></a></li> <% }) %>'),
        ui: {

        },
        events: {
            'keydown #hotel-name-input': 'searchHotelName',
            'click #cancel-search-hotel-name-btn': 'cancelSearchHotelName'
        },
        cancelSearchHotelName: function () {
            this.trigger('animHide');
        },
        searchHotelName: function (event) {
            var $this = PageView.$(event.currentTarget),
                value = PageView.$.trim($this.val());
            console.log(value, this.hotelNameTemplate);
            this.loadData({
                hotel_key: value,
                cityid: 2
            });
        },
        loadData: function (param) {
            PageView.$.ajax({
                url: 'http://english.dev.sh.ctriptravel.com/m/hotels/choosehotel/',
                type: 'post',
                data: param,
                dataType: 'josn',
                success: function (data) {

                }
            })
        }
    });

    return ChooseHotelNameView;
});