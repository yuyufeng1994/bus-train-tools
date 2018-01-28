// pages/me/me.js
const app = getApp()

Page({
  data: {
    motto: '欢迎使用巴铁助手',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null
  },
  onLoad: function () {
    this.getUserInfo();
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
      duration: 1000
    })
  },
  bindTest: function () {
    wx.showToast({
      title: '尽请期待',
      icon: 'loading',
      duration: 1000
    })
  },
  onShow: function () {
    this.getUserInfo();
    if (app.globalData.userInfo == null) {
      console.log('用户登陆中，请稍后..')
      wx.showToast({
        title: '用户登陆中，请稍后..',
        icon: 'none',
        duration: 1000,
        success: function () {
          wx.navigateTo({
            url: "../../index/index"
          })
        }
      })
    }
  },
  getUserInfo: function () {
    var that = this;

    this.setData({ userInfo: app.globalData.userInfo })

    //如果用户头像或用户名称为空，则使用微信的
    if (app.globalData.userInfo.userName == null || app.globalData.userInfo.userFigure == null) {
      // console.log("自动设置微信信息为账号信息")
      wx.getUserInfo({
        success: function (res) {
          //获取微信信息成功
          // console.log(res.userInfo)
          var updateUserInfo = {}
          if (app.globalData.userInfo.userName == null) {
            updateUserInfo.userName = res.userInfo.nickName
          }

          if (app.globalData.userInfo.userFigure == null) {
            updateUserInfo.userFigure = res.userInfo.avatarUrl
          }

          updateUserInfo.userId = app.globalData.userInfo.userId;
          updateUserInfo.session3Rd
          wx.getStorage({
            key: '3rd_session',
            success: function (res) {
              updateUserInfo.session3Rd = res.data
              updateUserInfo.key = app.globalData.serverKey
              wx.request({
                url: 'https://www.yuyufeng.top/mp/update-user',
                data: updateUserInfo,
                header: {
                  'Content-Type': 'application/json'
                },
                success: function (res) {
                  if (res.data.success == true) {
                    app.globalData.userInfo = res.data.data
                    that.setData({ userInfo: app.globalData.userInfo })
                  } else {
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }, fail: function () {
              //拿不到登录信息，则重新登录
              // console.log("拿不到登录信息，则重新登录")
              app.doLogin();
            }
          })

        }
      })

    }
  },
  toMyUserInfo: function () {
    //跳转到我的信息
    wx.navigateTo({ url: "../user-info/user-info" })
  }
})