//index.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../image/banner/banner1.png',
      '../../image/banner/banner2.png',
      '../../image/banner/banner3.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    currentCity:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if ('未知' == app.globalData.locationCity){
      wx.canIUse('getLocation')
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          wx.request({
            url: 'https://www.yuyufeng.top/mp/query-city-name?location=' + latitude + ',' + longitude,
            data: {},
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              var city = res.data.data;
              city = city.replace("市","")
              app.globalData.locationCity = city;
            }
          })
        }
      })
    }
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

  },
  bindTrainView: function () {
    wx.navigateTo({
      url: "../train-gruop/train/train?begin=&end=&date=" })
  }, bindBusView: function () {
    wx.navigateTo({ url: "../bus-gruop/bus/bus" })
  },
})