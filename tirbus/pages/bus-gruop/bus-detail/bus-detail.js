// pages/bus-gruop/bus-detail/bus-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginCity: null,
    endCity: null,
    leaveDate: null,
    leaveTime: null,
    busNo: null,
    listenType: 3
    // 杭州|平湖 | 2018 - 02 - 03 | 17:00|7812
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      beginCity: options.beginCity,
      endCity: options.endCity,
      leaveDate: options.leaveDate,
      leaveTime: options.leaveTime,
      busNo: options.busNo,
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)
    var formData = {};
    wx.getStorage({
      key: '3rd_session',
      success: function (res) {
        formData.session3Rd = res.data
        formData.key = app.globalData.serverKey
        formData.data = e.detail.value.beginCity + '|' + e.detail.value.endCity + '|' + e.detail.value.leaveDate + '|' + e.detail.value.leaveTime + '|' + e.detail.value.busNo
        formData.listenType = e.detail.value.listenType
        formData.formId = e.detail.formId
        wx.request({
          url: app.globalData.server + '/mp/do-listening',
          data: formData,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            var iconStr = "none"
            if (res.data.success == true) {
              iconStr = "success"
            }
            wx.showToast({
              mask: true,
              title: res.data.message,
              icon: iconStr,
              duration: 3000
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2000)
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
  },
  formReset: function () {
    console.log('form发生了reset事件')
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
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

  }
})