// pages/trains/trains.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginCity: null,
    endCity: null,
    leaveDate: null,
    errorMsg:'网络繁忙，请稍后再试',
    trains: {}
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
      url: 'https://www.yuyufeng.top/service/train/query-train-list',
      data: {
        departure: this.data.beginCity,
        destination: this.data.endCity,
        leaveDate: this.data.leaveDate
      },
      method: 'GET',
      success: function (res) {
        if (res.data.success == true) {
          var trains = res.data.data;
          that.setData({
            trains: trains
          })
        }else{
          that.setData({
            trains: null
          })
        }
        wx.hideLoading()
      }
    })

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
  trainTouched:function(){
    wx.showToast({
      title: '尽请期待',
      icon: 'loading',
      duration: 2000
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    
    wx.showLoading({
      title: '车次查询中',
    })

    wx.request({
      url: 'https://www.yuyufeng.top/service/train/query-train-list',
      data: {
        departure: this.data.beginCity,
        destination: this.data.endCity,
        leaveDate: this.data.leaveDate
      },
      method: 'GET',
      success: function (res) {
        if (res.data.success == true) {
          var trains = res.data.data;
          that.setData({
            trains: trains
          })
        } else {
          that.setData({
            trains: null
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh();
      }
    })
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
  
  }, bindDayDecr: function () {
    var that = this;
    var day = new Date(this.data.leaveDate)
    day.setTime(day.getTime() - 24 * 60 * 60 * 1000);

    var yesterday = new Date();
    yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
    if (day < yesterday) {
      wx.showToast({
        title: '日期已过，无法查询',
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

    wx.showLoading({
      title: '车次查询中',
    })

    wx.request({
      url: 'https://www.yuyufeng.top/service/train/query-train-list',
      data: {
        departure: this.data.beginCity,
        destination: this.data.endCity,
        leaveDate: this.data.leaveDate
      },
      method: 'GET',
      success: function (res) {
        if (res.data.success == true) {
          var trains = res.data.data;
          that.setData({
            trains: trains
          })
        } else {
          that.setData({
            trains: null
          })
        }
        wx.hideLoading()
      }
    })


  },
  bindDayIncr: function () {
    var that = this;
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
    wx.showLoading({
      title: '车次查询中',
    })

    wx.request({
      url: 'https://www.yuyufeng.top/service/train/query-train-list',
      data: {
        departure: this.data.beginCity,
        destination: this.data.endCity,
        leaveDate: this.data.leaveDate
      },
      method: 'GET',
      success: function (res) {
        if (res.data.success == true) {
          var trains = res.data.data;
          that.setData({
            trains: trains
          })
        } else {
          that.setData({
            trains: null
          })
        }
        wx.hideLoading()
      }
    })

  }
})