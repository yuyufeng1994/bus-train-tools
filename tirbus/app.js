//app.js
App({
  globalData: {
    trainBeginCity: '杭州',
    trainEndCity: '北京',
    locationCity: '上海',
    serverKey: '423ab978069235a7a2a8fd7a55e62d40'
  },
  onLaunch: function () {
    var that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })


    //获取当前城市
    // wx.authorize({scope:'scope.userLocation'})
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.request({
          url: 'https://www.yuyufeng.top/mp/query-city-name?location=' + latitude + ',' + longitude + '&key=' + that.globalData.serverKey,
          data: {},
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            var city = res.data.data;
            city = city.replace("市", "")
            that.globalData.locationCity = city;
          }
        })
      }
    })
  }
})