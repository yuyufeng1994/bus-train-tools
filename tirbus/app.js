//app.js
App({
    globalData: {
        // server:'https://www.yuyufeng.top',
        server: 'http://test.yuyufeng.top',
        trainBeginCity: '杭州',
        trainEndCity: '北京',
        locationCity: '未知',
        serverKey: '423ab978069235a7a2a8fd7a55e62d40',
        userInfo: null
    },
    onLaunch: function () {
        //检查是否已经有登录信息
        this.doCheckLogin();
    },
    doLogin: function () {
        console.log("开始登录")
        var that = this;
        wx.login({
            success:function(res) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
            url: that.globalData.server + '/mp/do-login',
            data: {code: res.code, key: that.globalData.serverKey},
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res){
            // console.log(res)
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
    },
            fail: function (res)
        {
            wx.showToast({
                title: '登录失败，服务器异常',
                icon: 'success',
                duration: 1000
            })
        }
    })
    }
    })
    },
    doCheckLogin: function () {
        // console.log("检查是否有登录信息")
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
                            url: that.globalData.server + '/mp/check-login',
                            data: {session3Rd: res.data, key: that.globalData.serverKey},
                            header: {
                                'Content-Type': 'application/json'
                            },
                            success: function (res) {
                            if(res.data.success == true)
                        {
                            wx.showToast({
                                title: '登录成功',
                                icon: 'success',
                                duration: 1000
                            })
                            that.globalData.userInfo = res.data.data
                            // console.log("用户信息已设置")
                        }
                    else
                        {
                            //服务器中没有登录信息，则重新登录
                            that.doLogin()
                        }
                    },
                            fail: function (res)
                        {
                            wx.showToast({
                                title: '登录失败，服务器异常',
                                icon: 'success',
                                duration: 1000
                            })
                        }

                    })
                    },
                    fail: function () {
                        //本地找不到，则重新登录
                        that.doLogin();
                    }
                })
            },
            fail: function () {
                //session已经过期，重新登录
                // console.log("session已经过期，重新登录")
                that.doLogin();
            }
        })
    }
})
