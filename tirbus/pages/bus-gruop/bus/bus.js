Page({
  data: {
    begin:'苏州',
    end:'平湖',
    date: null,
    busSearchHistory:null
  },

  formSubmit: function (e) {
    //历史纪录缓存
    var busSearchHistory;
    wx.getStorage({
      key: 'busSearchHistory',
      success: function (res) {
        busSearchHistory = res.data;
        var isHas = false;
        for (var i = 0; i < busSearchHistory.length; i++) {
          if (busSearchHistory[i].beginCity == e.detail.value.beginCity && busSearchHistory[i].endCity == e.detail.value.endCity) {
            //已经存在历史记录中，则排序到第一
            var tempSearchHistoryItem = busSearchHistory[0];
            busSearchHistory[0] = { beginCity: e.detail.value.beginCity, endCity: e.detail.value.endCity };
            busSearchHistory[i] = tempSearchHistoryItem
            isHas = true;
            break;
          }
        }
        if (!isHas) {
          busSearchHistory.unshift({ beginCity: e.detail.value.beginCity, endCity: e.detail.value.endCity })
        }

      },
      fail: function () {
        busSearchHistory = [{ beginCity: e.detail.value.beginCity, endCity: e.detail.value.endCity }];
      },
      complete: function () {

        if (busSearchHistory.length >= 4) {
          //异常，清空数组
          if (busSearchHistory.length > 4) {
            busSearchHistory = [];
          }
          busSearchHistory.pop();
        }

        wx.setStorage({
          key: "busSearchHistory",
          data: busSearchHistory
        })
      }
    })


    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.navigateTo({
      url: '../buses/buses?beginCity=' + e.detail.value.beginCity + "&endCity=" + e.detail.value.endCity + "&leaveDate=" + e.detail.value.leaveDate,
    })
  },
  historySearchBind:function(e){
    wx.getStorage({
      key: 'busSearchHistory',
      success: function (res) {
        var busSearchHistory = res.data;
        var isHas = false;
        for (var i = 0; i < busSearchHistory.length; i++) {
          if (busSearchHistory[i].beginCity == e.currentTarget.dataset.item.beginCity && busSearchHistory[i].endCity == e.currentTarget.dataset.item.endCity
          ) {
            //已经存在历史记录中，则排序到第一
            var tempSearchHistoryItem = busSearchHistory[0];
            busSearchHistory[0] = { beginCity: e.currentTarget.dataset.item.beginCity, endCity: busSearchHistory[i].endCity };
            busSearchHistory[i] = tempSearchHistoryItem
            isHas = true;
            break;
          }
        }
        wx.setStorage({
          key: "busSearchHistory",
          data: busSearchHistory
        })
      }
    })

    wx.navigateTo({
      url: '../buses/buses?beginCity=' + e.currentTarget.dataset.item.beginCity + "&endCity=" + e.currentTarget.dataset.item.endCity + "&leaveDate=" + this.data.date,
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  onLoad: function () {
    var day = new Date()
    var year = day.getFullYear();       //年
    var month = day.getMonth() + 1;     //月
    var day = day.getDate();            //日
    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }
    this.setData({ date: year + '-' + month + '-' + day })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onShow:function(){
    var that = this;
    var busSearchHistory;
    wx.getStorage({
      key: 'busSearchHistory',
      success: function (res) {
        busSearchHistory = res.data;
        that.setData({ busSearchHistory: busSearchHistory })
      },
      fail: function () {
       
      }
    })
  }
})