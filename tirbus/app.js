//app.js
App({
  globalData: {
    trainBeginCity: '杭州',
    trainEndCity: '北京',
    locationCity: '未知',
    serverKey: '423ab978069235a7a2a8fd7a55e62d40',
    userInfo: null
  },
  onLaunch: function () {
    var that = this
    // 登录

    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        // console.log("session 未过期")
        wx.getStorage({
          key: '3rd_session',
          success: function (res) {
            wx.request({
              url: 'http://test.yuyufeng.top/mp/check-login',
              data: { session3Rd: res.data },
              header: {
                'Content-Type': 'application/json'
              },
              success: function (res) {
                console.log(res)
                if (res.data.success == true) {
                  wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 1000
                  })
                  that.globalData.userInfo = res.data.data
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                  })
                }

              }
            })
          },
          fail: function () {
            //本地找不到，则重新登录
            wx.login({
              success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                  url: 'http://test.yuyufeng.top/mp/do-login',
                  data: { code: res.code },
                  header: {
                    'Content-Type': 'application/json'
                  },
                  success: function (res) {
                    wx.setStorage({
                      key: "3rd_session",
                      data: res.data.message
                    })
                    if (res.data.success == true) {
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.globalData.userInfo = res.data.data
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
      },
      fail: function () {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: 'http://test.yuyufeng.top/mp/do-login',
              data: { code: res.code },
              header: {
                'Content-Type': 'application/json'
              },
              success: function (res) {
                wx.setStorage({
                  key: "3rd_session",
                  data: res.data.message
                })

                if (res.data.success == true) {
                  wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 1000
                  })
                  that.globalData.userInfo = res.data.data
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






    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })



  }
})