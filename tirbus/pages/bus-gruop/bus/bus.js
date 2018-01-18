Page({
  data: {
    date: null
  },

  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.navigateTo({
      url: '../buses/buses?beginCity=' + e.detail.value.beginCity + "&endCity=" + e.detail.value.endCity + "&leaveDate=" + e.detail.value.leaveDate,
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  onLoad: function () {
    var day = new Date()
    var year = day.getFullYear();       //年
    var month = day.getMonth() + 1;     //月
    var day = day.getDate();            //日
    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }
    this.setData({ date: year + '-' + month + '-' + day })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})