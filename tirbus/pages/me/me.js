// pages/me/me.js
const app = getApp()

Page({
  data: {
    motto: '欢迎使用巴铁助手',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  onLoad: function () {
    var that = this;

    wx.getUserInfo({
      success: function (res) {
        app.globalData.userInfo = res.userInfo;
        that.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      }
    })

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindSettings: function () {
    wx.openSetting({})
  }, bindAbout: function () {
    wx.navigateTo({ url: "../about/about" })
  }, bindService: function () {
    wx.cont
  },
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  bindList: function () {
    wx.showToast({
      title: '尽请期待',
      icon: 'loading',
      duration: 2000
    })
  },
  bindTest: function () {
    wx.showToast({
      title: '尽请期待',
      icon: 'loading',
      duration: 2000
    })
  }
})