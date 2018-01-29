const app = getApp()

Page({
  data: {
    begin: null,
    end: null,
    date: null,
    trainSearchHistory:null
  },

  formSubmit: function (e) {
    //历史纪录缓存
    var trainSearchHistory;
     wx.getStorage({
      key: 'trainSearchHistory',
      success: function(res) {
        trainSearchHistory = res.data;
        var isHas = false;
        for (var i = 0; i < trainSearchHistory.length;i++){
          if (trainSearchHistory[i].beginCity == e.detail.value.beginCity && trainSearchHistory[i].endCity == e.detail.value.endCity){
            //已经存在历史记录中，则排序到第一
            var tempSearchHistoryItem = trainSearchHistory[0];
            trainSearchHistory[0] = { beginCity: e.detail.value.beginCity, endCity: e.detail.value.endCity };
            trainSearchHistory[i] = tempSearchHistoryItem
            isHas = true;
            break;
          }
        }
        if (!isHas){
          trainSearchHistory.unshift({ beginCity: e.detail.value.beginCity, endCity: e.detail.value.endCity })
        }
       
      },
      fail:function(){
        trainSearchHistory = [{ beginCity: e.detail.value.beginCity, endCity: e.detail.value.endCity }];
      },
      complete: function () {

        if (trainSearchHistory.length >= 4) {
          //异常，清空数组
          if (trainSearchHistory.length > 4) {
            trainSearchHistory = [];
          }
          trainSearchHistory.pop();
        }

        wx.setStorage({
          key: "trainSearchHistory",
          data: trainSearchHistory
        })
      }
    })
    
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.navigateTo({
      url: '../trains/trains?beginCity=' + e.detail.value.beginCity + "&endCity=" + e.detail.value.endCity + "&leaveDate=" + e.detail.value.leaveDate,
    })
  }, historySearchBind:function(e){
    app.globalData.trainBeginCity = e.currentTarget.dataset.item.beginCity
    app.globalData.trainEndCity = e.currentTarget.dataset.item.endCity

    wx.getStorage({
      key: 'trainSearchHistory',
      success: function (res) {
        var trainSearchHistory = res.data;
        var isHas = false;
        for (var i = 0; i < trainSearchHistory.length; i++) {
          if (trainSearchHistory[i].beginCity == e.currentTarget.dataset.item.beginCity && trainSearchHistory[i].endCity == e.currentTarget.dataset.item.endCity
) {
            //已经存在历史记录中，则排序到第一
            var tempSearchHistoryItem = trainSearchHistory[0];
            trainSearchHistory[0] = { beginCity: e.currentTarget.dataset.item.beginCity, endCity: trainSearchHistory[i].endCity };
            trainSearchHistory[i] = tempSearchHistoryItem
            isHas = true;
            break;
          }
        }
        wx.setStorage({
          key: "trainSearchHistory",
          data: trainSearchHistory
        })
      }
    })

    wx.navigateTo({
      url: '../trains/trains?beginCity=' + e.currentTarget.dataset.item.beginCity + "&endCity=" + e.currentTarget.dataset.item.endCity + "&leaveDate=" + this.data.date,
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
  onLoad: function (options) {

    //获取当前城市
    if (app.globalData.locationCity == '未知') {
      // wx.authorize({scope:'scope.userLocation'})
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          wx.request({
            url: app.globalData.server +'/mp/query-city-name?location=' + latitude + ',' + longitude + '&key=' + app.globalData.serverKey,
            data: {},
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              var city = res.data.data;
              city = city.replace("市", "")
              app.globalData.locationCity = city;
            }
          })
        }
      })
    }


    //获取明天日期到表单
    if (this.data.date == null || this.data.date.trim() == "") {
      var day = new Date()
      day.setTime(day.getTime() + 24 * 60 * 60 * 1000);
      var year = day.getFullYear();       //年
      var month = day.getMonth() + 1;     //月
      var day = day.getDate();            //日

      if (month < 10) { month = "0" + month; }
      if (day < 10) { day = "0" + day; }
      this.setData({ date: year + '-' + month + '-' + day })
    }
  }, onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }, bindBeginCityView: function () {
    wx.navigateTo({
      url: '../citys/citys?cityType=begin',
    })
  }, bindEndCityView: function () {
    wx.navigateTo({
      url: '../citys/citys?cityType=end',
    })
  }, onShow: function () {
    var that = this;
    var trainSearchHistory;
    wx.getStorage({
      key: 'trainSearchHistory',
      success: function (res) {
        trainSearchHistory = res.data;
        that.setData({ begin: app.globalData.trainBeginCity, end: app.globalData.trainEndCity, trainSearchHistory: trainSearchHistory})
      },
      fail: function () {
        that.setData({ begin: app.globalData.trainBeginCity, end: app.globalData.trainEndCity})
      }
    })
    
  }
})