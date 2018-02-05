// pages/buses/buses.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    beginCity: null,
    endCity: null,
    leaveDate: null,
    buses: {},
    nobusFlag: false,
    errorMsg: '网络繁忙，请稍后再试',
    bindDayDecrShow: true,
  },
  busTouched: function (e) {
    console.log(e)
    var busDetail = e.currentTarget.dataset.item
    var that = this
    wx.navigateTo({
      url: '../bus-detail/bus-detail?beginCity=' + that.data.beginCity + '&endCity=' + that.data.endCity + '&leaveDate=' + that.data.leaveDate + '&leaveTime=' + busDetail.busTime + '&busNo=' + busDetail.busNo
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      beginCity: options.beginCity,
      endCity: options.endCity,
      leaveDate: options.leaveDate
    })
    wx.setNavigationBarTitle({
      title: this.data.beginCity + ' - ' + this.data.endCity,
    })
    wx.showLoading({
      title: '车次查询中',
    })

    wx.request({
      url: app.globalData.server + '/service/bus/query-bus-list',
      data: {
        departure: this.data.beginCity,
        destination: this.data.endCity,
        leaveDate: this.data.leaveDate
      },
      method: 'GET',
      success: function (res) {
        if (res.data.success == true) {
          var buses = res.data.data;
          that.setData({
            buses: buses
          })
        } else {
          that.setData({
            buses: null
          })
        }
        wx.hideLoading()
      }
    }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //如果当前时间前一天小于今天，则置灰
    var todayTemp = new Date();
    var yearTemp = todayTemp.getFullYear();       //年
    var monthTemp = todayTemp.getMonth() + 1;     //月
    var dayTemp = todayTemp.getDate();            //日
    if (monthTemp < 10) { monthTemp = "0" + monthTemp; }
    if (dayTemp < 10) { dayTemp = "0" + dayTemp; }
    var todayStr = yearTemp + '-' + monthTemp + '-' + dayTemp;

    if (this.data.leaveDate == todayStr) {
      this.setData({ bindDayDecrShow: false })
    } else {
      this.setData({ bindDayDecrShow: true })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindDayDecr: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })

    var day = new Date(this.data.leaveDate)
    day.setTime(day.getTime() - 24 * 60 * 60 * 1000);

    var yesterday = new Date();
    yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
    if (day < yesterday) {
      wx.showToast({
        title: '抱歉，无法查询今天之前的车次',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    var year = day.getFullYear();       //年
    var month = day.getMonth() + 1;     //月
    var day = day.getDate();            //日
    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }
    this.setData({
      leaveDate: year + '-' + month + '-' + day
    })
    var that = this;
    wx.showLoading({
      title: '车次查询中',
    })
    wx.request({
      url: app.globalData.server + '/service/bus/query-bus-list',
      data: {
        departure: this.data.beginCity,
        destination: this.data.endCity,
        leaveDate: this.data.leaveDate
      },
      method: 'GET',
      success: function (res) {
        var buses = res.data.data;
        that.setData({
          buses: buses
        })
        wx.stopPullDownRefresh();
        wx.hideLoading();
      }
    })


    //如果当前时间前一天小于今天，则置灰
    var todayTemp = new Date();
    var yearTemp = todayTemp.getFullYear();       //年
    var monthTemp = todayTemp.getMonth() + 1;     //月
    var dayTemp = todayTemp.getDate();            //日
    if (monthTemp < 10) { monthTemp = "0" + monthTemp; }
    if (dayTemp < 10) { dayTemp = "0" + dayTemp; }
    var todayStr = yearTemp + '-' + monthTemp + '-' + dayTemp;

    if (this.data.leaveDate == todayStr) {
      this.setData({ bindDayDecrShow: false })
    }

  },
  bindDayIncr: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })

    this.setData({ bindDayDecrShow: true })

    var day = new Date(this.data.leaveDate)
    day.setTime(day.getTime() + 24 * 60 * 60 * 1000);
    var year = day.getFullYear();       //年
    var month = day.getMonth() + 1;     //月
    var day = day.getDate();            //日
    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }
    this.setData({
      leaveDate: year + '-' + month + '-' + day
    })

    var that = this;
    wx.showLoading({
      title: '车次查询中',
    })
    wx.request({
      url: app.globalData.server + '/service/bus/query-bus-list',
      data: {
        departure: this.data.beginCity,
        destination: this.data.endCity,
        leaveDate: this.data.leaveDate
      },
      method: 'GET',
      success: function (res) {
        var buses = res.data.data;
        that.setData({
          buses: buses
        })
        wx.stopPullDownRefresh();
        wx.hideLoading();
      }
    })


  },
  onPullDownRefresh: function () {
    var that = this;
    wx.showLoading({
      title: '车次查询中',
    })
    wx.request({
      url: app.globalData.server + '/service/bus/query-bus-list',
      data: {
        departure: this.data.beginCity,
        destination: this.data.endCity,
        leaveDate: this.data.leaveDate
      },
      method: 'GET',
      success: function (res) {
        var buses = res.data.data;
        that.setData({
          buses: buses
        })
        wx.stopPullDownRefresh();
        wx.hideLoading();
      }
    })

  }

})