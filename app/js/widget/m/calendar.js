define(['jquery'], function($) {
    Date.prototype.format = function(format) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        return format;
    };
    Date.prototype.addDays = function(n, isDate) {
        var oDate, getInfo = function() {
                var sYear = oDate.getFullYear(),
                    sMonth = oDate.getMonth(),
                    sDate = oDate.getDate();
                if (sMonth === 0) {
                    sMonth = 1;
                } else {
                    sMonth = sMonth + 1;
                }
                if (sMonth < 10) {
                    sMonth = '0' + sMonth.toString();
                }
                if (sDate < 10) {
                    sDate = '0' + sDate.toString();
                }
                return sYear + '/' + sMonth + '/' + sDate;
            };
        oDate = this.setDate(this.getDate() + n);
        oDate = new Date(oDate);
        if (isDate) return oDate;
        return getInfo();
    };

    DisplayCalendar = function(option) {
        // this.aWeek = docket.common().weeks;
        // this.today = docket.common().today,
        // this.month = docket.common().month,
        // this.sDate = docket.common().sDate;
        this.aWeek = ["Sun", " Mon", " Tue", " Wed", " Thu", " Fri", " Sat"];
        this.today = "today",
        this.month = ["Jan", "Jan", " Feb", " Mar", " Apr", " May", " Jun", " Jul", " Aug", " Sep", " Oct", " Nov", " Dec"],
        this.sDate = 'Day';

        this.dWrap = option.dWrap;
        this.dStartInput = option.dStartInput;
        this.dBackInput = option.dBackInput;
        this.monthRange = option.monthRange || 6;
        // this.isSuportAnimate = ctripmobi.utils.isSuportAnimate();
        this.isSuportAnimate = false;
        //var s = docket.common().timeNow;
        var s ;

        this.ServerDate = s ? s : null;
        this.sStartDate = option.CheckInDate ? option.CheckInDate.replace(/-/g, "/") : ((s && new Date(s.replace(/-/g, '/')).format('yyyy/MM/dd')) || new Date().format('yyyy/MM/dd'));
        this.sBackDate = option.CheckOutDate ? option.CheckOutDate.replace(/-/g, "/") : ((s && new Date(s.replace(/-/g, '/')).addDays(1)) || new Date().addDays(1));
        this.limitDays = option.limitDays;
        this.sStartTitle = option.sStartTitle;
        this.titelClassName = option.titelClassName;
        this.sBackTitle = option.sBackTitle;
        var self = this;
        this.sLastDate = '';
        this.BeginDate;
        this.EndDate;
        this.callback = option.callback || function() {};
        this.beforcallback = option.beforCallback || function() {};
        this.aBackCallback = option.aBackCallback || function() {};
        this.unInitCallback = option.unInitCallback || 0;
        this.onlyShowStrat = option.onlyShowStrat || 0;
        this.callbacks = [];
        this.bStartFocused = true;
        this.startDatePos;
        this.fromFlights = option.fromFlights || 0;

        this.createCalendar();
    };
    DisplayCalendar.prototype = {
        updateByTime: function (startTime, endTime) {
            if (startTime) {
                this.chooseStart();
                this.compareTime(startTime);
            }

            if (endTime) {
                this.choosedBack();
                this.compareTime(endTime);
            }
        },
        compareTime: function (time) {
            var self = this, $this;
            this.dWrap.find('td').each(function () {
                $this = $(this);
                if ($this.attr('date') === time) {
                    self.chooseDays($this);
                }
            });
        },
        getNextDay: function(sDate) {
            var aDate = sDate.split('/');
            return new Date(aDate[0], parseInt(aDate[1], 10) - 1, parseInt(aDate[2], 10) + 1).format('yyyy/MM/dd');
        },
        isLeap: function(year) {

            return (year % 100 == 0 ? res = (year % 400 == 0 ? 1 : 0) : res = (year % 4 == 0 ? 1 : 0));
        },
        createCalendar: function() {
            var self = this,
                sHtml = '<header><a id="calenderBack" class="'+this.titelClassName+'"></a><h1 class="page_title">' + this.sTitle + '</h1></header><section class="inside_calendar" style="overflow-y: auto; overflow-x: hidden;">';

            for (var i = 0; i < this.monthRange; i++) {
                sHtml += this.createSingleCalendar(i);
            }
            sHtml += '</section>',
            this.dWrap.html(sHtml);

            this.bindEvents();

            this.sLastDate = $('td[nextdate]').last().attr('date');

            var nIndex = $('[date="' + this.sStartDate + '"]').index();

            if (this.callback && !this.unInitCallback) {
                var obj = {};

                obj.start = this.infoMaker(this.sStartDate, nIndex);
                if (this.dBackInput) {
                    obj.back = this.infoMaker(this.sBackDate, nIndex + 1);
                }
                this.callback.call(this, obj, true);
            }
        },
        createSingleCalendar: function(n) {
            var aHtml = [],
                currentDate = this.ServerDate ? new Date(this.ServerDate.replace(/-/g, '/')) : new Date(),
                yearNow = currentDate.getFullYear(),
                monthNow = currentDate.getMonth() + n,
                dateNow = currentDate.format('yyyy/MM/dd'),
                nextDate = this.getNextDay(dateNow),
                next2Date = this.getNextDay(nextDate),
                firstdayInMonth = new Date(yearNow, monthNow, 1);
            yearNow = firstdayInMonth.getFullYear(),
            firstday = firstdayInMonth.getDay(),
            monthNow = firstdayInMonth.getMonth(),
            monthDays = new Array(31, 28 + this.isLeap(yearNow), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            if (this.EndDate && this.EndDate < firstdayInMonth) return '';
            column = Math.ceil((monthDays[monthNow] + firstday) / 7);
            aHtml.push('<div class="calendar_sel_month"><em>' + this.month[monthNow + 1] + ' ' + yearNow + '</em></div>');
            aHtml.push('<table class="calendar_sel_day"><thead><tr><td>' + this.aWeek[0] + '</td><td>' + this.aWeek[1] + '</td><td>' + this.aWeek[2] + '</td><td>' + this.aWeek[3] + '</td><td>' + this.aWeek[4] + '</td><td>' + this.aWeek[5] + '</td><td>' + this.aWeek[6] + '</td></tr></thead><tbody>');
            for (var i = 0; i < column; i++) {
                aHtml.push("<tr>");
                for (var k = 0; k < 7; k++) {
                    var oDate,
                        sDate,
                        sNextDate,
                        index = i * 7 + k,
                        date_number = index - firstday + 1;
                    if (date_number <= 0 || date_number > monthDays[monthNow]) {

                        date_number = "&nbsp;";
                        sDate = null;
                    } else {
                        oDate = new Date(yearNow, monthNow, date_number);

                        sDate = oDate.format('yyyy/MM/dd');

                        sNextDate = new Date(yearNow, monthNow, date_number + 1).format('yyyy/MM/dd');
                    }

                    if (sDate) {
                        var s = '<td nextdate=' + sNextDate + ' date=' + sDate + ' ',
                            sClass = '',

                            aDate = sDate.split('/'),
                            complete = true;
                        if (dateNow > sDate || this.BeginDate && this.EndDate <= oDate) {

                            sClass = 'class=ago';
                        }

                        if (complete && dateNow == sDate) {
                            s += 'class="today">' + date_number + '<em>' + this.today + '</em>' + '</td>';
                            complete = false;
                        }

                        if (complete) {
                            s += sClass + '>' + date_number + '</td>';
                        }
                        aHtml.push(s);
                    } else {
                        aHtml.push("<td class='blank'>" + date_number + "</td>");
                    }
                }
                aHtml.push("</tr>");
            }
            aHtml.push("</tbody></table>");
            return aHtml.join('');
        },
        renderLimitDays: function() {

            var aStarDate = this.sStartDate;
            $('td[date]').addClass('ago');
            for (var i = 0; i < this.limitDays; i++) {
                var sDate = new Date(aStarDate[0], parseInt(aStarDate[1], 10) - 1, parseInt(aStarDate[2], 10) + i).format('yyyy/MM/dd');
                $('[date="' + sDate + '"]').removeClass('ago');
            }
        },
        renderSelectDays: function() {
            if (this.sStartDate && this.sBackDate) {
                var targetDate = this.sStartDate,
                    dataLenght = $('td[date]').length,
                    todayDate = $("td.today");
                if (!this.fromFlights) {
                    $('td[date]').removeClass('sel');
                    for (var i = 0; i < dataLenght; i++) {
                        targetDate = this.getNextDay(targetDate);
                        if (targetDate >= this.sBackDate) break;
                        $('[date="' + targetDate + '"]').addClass("sel");

                    }
                }

                targetDate = todayDate.attr("date");
                if (this.bStartFocused) {
                    for (var i = 0; i < dataLenght; i++) {
                        if (targetDate >= this.sStartDate) break;
                        $('[date="' + targetDate + '"]').removeClass("ago");
                        targetDate = this.getNextDay(targetDate);
                    }
                } else {
                    for (var i = 0; i < dataLenght; i++) {
                        if (targetDate >= this.sStartDate) break;
                        $('[date="' + targetDate + '"]').addClass("ago");
                        targetDate = this.getNextDay(targetDate);
                    }
                }
            }
        },
        resetCalendar: function() {

            this.dWrap.find('.cur').removeClass('cur');

            if (this.dBackInput) {
                var dStartDate = $('[date="' + this.sStartDate + '"]'),
                    dEndDate = $('[date="' + this.sBackDate + '"]');
                dStartDate.addClass('cur');
                if (!this.dBackInput.attr("hide")) dEndDate.addClass('cur');
                this.renderSelectDays();
                var datebox;
                $('.calendar_sel_day').removeAttr('id');
                if (dStartDate.length) {
                    datebox = dStartDate.closest('.calendar_sel_day');
                    datebox.attr('id', 'datestarttag');
                } else if (dEndDate.length) {
                    datebox = dStartDate.closest('.calendar_sel_day');
                    datebox.attr('id', 'datestarttag');

                }

                if (window.DisplayCalendar.single) {
                    dEndDate.removeClass('cur');

                }
            } else {
                var dStartDate = $('[date="' + this.sStartDate + '"]');
                dStartDate.addClass('cur');
                var datebox;
                $('.calendar_sel_day').removeAttr('id');
                if (dStartDate.length) {
                    datebox = dStartDate.closest('.calendar_sel_day');
                    datebox.attr('id', 'datestarttag');
                }
            }
        },
        infoMaker: function(sDate, nIndex) {
            if (sDate) {
                var obj = $('[date="' + sDate + '"]'),
                    sHtml = obj.html(),
                    dayDesc = obj.attr('data-day') || '',
                    aDate = sDate.split('/'),
                    nIndex = nIndex == 7 ? 0 : nIndex,
                    oJson = {};
                oJson['year'] = aDate[0];
                oJson['month'] = parseInt(aDate[1], 10);
                oJson['sMonth'] = this.month[oJson['month']];
                oJson['date'] = parseInt(aDate[2], 10);
                oJson['sDate'] = this.sDate;
                oJson['sWeek'] = this.aWeek[nIndex];
                oJson['des'] = isNaN(parseInt(sHtml, 10)) ? sHtml : '';
                oJson['full'] = sDate;
                oJson['daydesc'] = dayDesc || '';
                return oJson;
            }
        },
        chooseDays: function(target) {
            if (!target.hasClass('ago') && target.attr('date')) {
                var sDate = target.attr('date'),
                    nIndex = target.index(),
                    obj = {};

                if (this.dBackInput && this.bStartFocused && sDate == this.sLastDate) {

                    if (!window.DisplayCalendar.single) {
                        return;
                    }
                }

                if (this.dBackInput) {
                    if (this.bStartFocused) {

                        this.sStartDate = sDate;
                        this.sBackDate = this.sStartDate >= this.sBackDate ? target.attr('nextdate') : this.sBackDate;

                        obj.start = this.infoMaker(this.sStartDate, nIndex);
                        obj.back = this.infoMaker(this.sBackDate, nIndex + 1);
                    } else {

                        if (sDate == this.sStartDate && !this.bStartFocuse && !this.fromFlights) {

                            return;
                        } else {
                            this.sBackDate = sDate;

                            obj.back = this.infoMaker(this.sBackDate, nIndex);
                        }
                    }
                } else {
                    this.sStartDate = sDate;

                    obj.start = this.infoMaker(this.sStartDate, nIndex);
                }
                target.addClass('cur');


                if (this.callback) {
                    this.callback(obj);
                }
                for (var i = 0, I = this.callbacks.length; i < I; i++) {
                    this.callbacks[i].call(this, obj);
                }
            }
        },
        chooseStart: function() {

            this.bStartFocused = true;
            this.dWrap.find("header h1").text(this.sStartTitle);
            this.resetCalendar();

            typeof this.OnShow == 'function' && this.OnShow();


        },
        choosedBack: function() {

            this.bStartFocused = false;
            this.dWrap.find("header h1").text(this.sBackTitle);
            this.resetCalendar();
            if (this.limitDays) {
                this.renderLimitDays();
            }


        },
        bindEvents: function() {
            var self = this;

            this.dWrap.delegate('td', 'click', function(e) {
                e.preventDefault();
                self.chooseDays($(this));
            });
            $("body").on('click',"#calenderBack", function(e) {
                e.preventDefault();
                self.aBackCallback();
            });

            if (this.dStartInput) {
                this.dStartInput.bind('click', function(e) {
                    self.beforcallback();
                    e.preventDefault();
                    self.chooseStart();
                });
            }

            if (this.dBackInput) {
                this.dBackInput.bind('click', function(e) {
                    self.beforcallback();
                    e.preventDefault();
                    self.choosedBack();
                });
            }
        },
        getStartDate: function() {
            return this.sStartDate;
        },
        getEndDate: function() {
            return this.sBackDate;
        },
        addCallback: function(fun) {
            typeof fun == 'function' && this.callbacks.push(fun);
        },
        triggerCallBack: function() {
            this.chooseDays($('[date="' + this.sStartDate + '"]'));
        },
        OnShow: function() {},
        OnHide: function() {}
    }


    function getPosition(element) {
        var top = 0,
            left = 0;
        if (element) {
            do {
                top += element.offsetTop;
                left += element.offsetLeft;
            } while (element = element.offsetParent);
        }
        return {
            top: top,
            left: left
        };
    }
    return DisplayCalendar;
});
