// pages/me/me.js
const app = getApp()

Page({
  data: {
    motto: '欢迎使用巴铁助手',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  onLoad: function () {
    var that = this;
    if (this.data.userInfo == null) {
      this.setData({ userInfo: app.globalData.userInfo })
    }


    //如果用户头像或用户名称为空，则使用微信的
    if (app.globalData.userInfo.userName == null || app.globalData.userInfo.userFigure == null) {
      console.log("自动设置微信信息为账号信息")
      wx.getUserInfo({
        success: function (res) {
          console.log(res.userInfo)
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
                url: 'http://test.yuyufeng.top/mp/update-user',
                data: updateUserInfo,
                header: {
                  'Content-Type': 'application/json'
                },
                success: function (res) {
                  if (res.data.success == true) {
                    app.globalData.userInfo = res.data.data
                    that.data.userInfo = app.globalData.userInfo
                    console.log(that.data.userInfo)
                  } else {
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none',
                      duration: 1000
                    })
                  }

                }
              })
            }
          })

        }
      })

    }






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
    //震动
    // wx.vibrateLong({
    //   success:function(){
    //     console.log('vibrateLong.success')
    //   },
    //   fail:function(){
    //     console.log('vibrateLong.fail')
    //   }
    // })

    // wx.vibrateShort({
    //   success: function () {
    //     console.log('vibrateShort.success')
    //   },
    //   fail: function () {
    //     console.log('vibrateShort.fail')
    //   }
    // })

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
  },
  onShow:function(){
    console.log(this.data.userInfo)
  }
})