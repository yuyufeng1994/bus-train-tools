// pages/my-gruop/user-info/user-info.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
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
    this.setData({ userInfo: app.globalData.userInfo })
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
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000)
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
  doCancel:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  formSubmit: function (e) {
    var updateUserInfo = {}
    updateUserInfo.userName = e.detail.value.userName
    updateUserInfo.userId = app.globalData.userInfo.userId;
    wx.getStorage({
      key: '3rd_session',
      success: function (res) {
        updateUserInfo.session3Rd = res.data
        updateUserInfo.key = app.globalData.serverKey
        wx.request({
          url: app.globalData.server +'/mp/update-user',
          data: updateUserInfo,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            // console.log(res)
            if (res.data.success == true) {
              app.globalData.userInfo = res.data.data
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000
              })

              //自动返回
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
              

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
        wx.showToast({
          title: '获取用户信息失败，请重新登录',
          icon: 'none',
          duration: 1000
        })
        app.doLogin();
      }
    })
    // console.log('form发生了submit事件，携带数据为：', e.detail.value.userName)
  }, 
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000)
  },
})