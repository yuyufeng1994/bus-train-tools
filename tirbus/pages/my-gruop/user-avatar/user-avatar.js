// pages/my-gruop/user-avatar/user-avatar.js
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
  doSaveImage:function(){
    //保存头像到本地
    var that = this;
    
    wx.getImageInfo({
      src: that.data.userInfo.userFigure,
      success: function (res){
        // console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            // console.log(res)
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            })
          },fail:function(res){
            // console.log(res)
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    })
  }
})