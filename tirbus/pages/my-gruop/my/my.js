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

    if (app.globalData.userInfo == null) {
      //拿不到登录信息，则重新登录
      // console.log("拿不到登录信息，则重新登录")
      wx.showToast({
        title: '获取用户信息失败，请重新登录',
        icon: 'none',
        duration: 1000
      })
      app.doLogin();
      return;
    }

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
          wx.getStorage({
            key: '3rd_session',
            success: function (res) {
              updateUserInfo.session3Rd = res.data
              updateUserInfo.key = app.globalData.serverKey
              wx.request({
                url: app.globalData.server + '/mp/update-user',
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
              wx.showToast({
                title: '获取用户信息失败，请重新登录',
                icon: 'none',
                duration: 1000
              })
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
  },
  editAvatar: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['查看头像', '编辑头像'],
      success: function (res) {
        if ("0" == res.tapIndex) {
          wx.navigateTo({ url: "../user-avatar/user-avatar" })
        } else if ("1" == res.tapIndex) {
          //选择头像
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              console.log(res)
              var updateUserInfo = {}

              updateUserInfo.userId = app.globalData.userInfo.userId;
              wx.getStorage({
                key: '3rd_session',
                success: function (res) {
                  updateUserInfo.session3Rd = res.data
                  updateUserInfo.key = app.globalData.serverKey
                  //上传头像
                  wx.uploadFile({
                    url: app.globalData.server + '/mp/uploadImage', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    header: {
                      'Content-Type': 'application/json'
                    },
                    formData: updateUserInfo,
                    success: function (res) {
                      console.log('上传头像成功')
                      var data = JSON.parse(res.data)
                      console.log(data.data)
                      app.globalData.userInfo = data.data
                      that.setData({ userInfo: app.globalData.userInfo })
                      wx.showToast({
                        title: '修改头像成功',
                        icon: 'success',
                        duration: 1000
                      })
                    }, fail: function (res) {
                      console.log('上传头像失败')
                      //头像上传失败
                      wx.showToast({
                        title: '修改头像失败',
                        icon: 'none',
                        duration: 1000
                      })
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


            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})