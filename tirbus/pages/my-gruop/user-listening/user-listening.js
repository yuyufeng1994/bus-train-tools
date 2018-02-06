// pages/my-gruop/user-listening/user-listening.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    listenList:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var formData = {};
    wx.getStorage({
      key: '3rd_session',
      success: function (res) {
        formData.session3Rd = res.data
        formData.key = app.globalData.serverKey
        formData.page = that.data.page
        formData.rows = 10
        wx.request({
          url: app.globalData.server + '/mp/list-listening',
          data: formData,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            if(res.data.success == true){
              that.setData({
                listenList: res.data.data,
                page:that.data.page+1
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
    this.setData({page:1})
    var that = this
    var formData = {};
    wx.getStorage({
      key: '3rd_session',
      success: function (res) {
        formData.session3Rd = res.data
        formData.key = app.globalData.serverKey
        formData.page = that.data.page
        formData.rows = 10
        wx.request({
          url: app.globalData.server + '/mp/list-listening',
          data: formData,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            // console.log(res)
            if (res.data.success == true) {
              that.setData({
                listenList: res.data.data,
                page: that.data.page + 1
              })
            }
          },
          complete:function(){
            wx.stopPullDownRefresh();
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var formData = {};
    wx.getStorage({
      key: '3rd_session',
      success: function (res) {
        formData.session3Rd = res.data
        formData.key = app.globalData.serverKey
        formData.page = that.data.page
        formData.rows = 10
        wx.request({
          url: app.globalData.server + '/mp/list-listening',
          data: formData,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            // console.log(res)
            if (res.data.success == true && res.data.data.length > 0) {
              var listenListTemp = that.data.listenList
              for(var i=0;i<res.data.data.length;i++){
                listenListTemp.push(res.data.data[i])
              }
              that.setData({
                listenList: listenListTemp,
                page: that.data.page + 1
              })
            }else{
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none',
                duration: 2000
              })
            }
          },
          complete:function(){
            wx.hideLoading();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})