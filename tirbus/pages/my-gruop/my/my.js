// pages/me/me.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    listening:0,
    listeningTimes:0,
    notified:0,
    listeningAll:0
  },
  onLoad: function () {
    this.getUserInfo();
    this.countListen();
  },
  bindSettings: function () {
    wx.openSetting({})
  }, bindAbout: function () {
    wx.navigateTo({ url: "../about/about" })
  }, bindService: function () {
    wx.cont
  },
  onPullDownRefresh: function () {
    this.countListen();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  bindList: function () {
    wx.navigateTo({
      url: '../user-listening/user-listening',
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
        duration: 2000
      })
      setTimeout(function(){
        wx.switchTab({
          url: "../../index/index"
        })
      },2000)
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
      itemList: ['查看头像', '修改头像'],
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
                      console.log(res)
                      var data = JSON.parse(res.data)
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
  },
  countListen:function(){
    var that = this
    var formData = {};
    wx.getStorage({
      key: '3rd_session',
      success: function (res) {
        formData.session3Rd = res.data
        formData.key = app.globalData.serverKey
        wx.request({
          url: app.globalData.server + '/mp/listening-count',
          data: formData,
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            if (res.data.success == true) {
              that.setData({
                listening: res.data.data[0],
                notified: res.data.data[1],
                listeningTimes: res.data.data[2],
                listeningAll: res.data.data[3]
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
  }, scanTap:function(){
    //扫码登录
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res_uuid) => {
        wx.showModal({
          title: '登录确认',
          content: '心得站点（www.yuyufeng.top）请求登录',
          success: function (res) {
            if (res.confirm) {
              var loginInfo = {}
              loginInfo.scanLoginUUID = res_uuid.result
              wx.getStorage({
                key: '3rd_session',
                success: function (res) {
                  loginInfo.session3Rd = res.data
                  loginInfo.key = app.globalData.serverKey
                  wx.request({
                    url: app.globalData.server + '/do-login-scan',
                    data: loginInfo,
                    header: {
                      'Content-Type': 'application/json'
                    },
                    success: function (res) {
                      if (res.data.success == true){
                        wx.showToast({
                          title: '扫码登录成功',
                          icon: 'none',
                          duration: 1000
                        })
                      }else{
                        wx.showToast({
                          title: '扫码登录失败',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    },fail:function(res){
                      wx.showToast({
                        title: '扫码登录失败',
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
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        
      }
    })
  }
})