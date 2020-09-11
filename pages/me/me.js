const app = getApp()

Page({
  data: {
    time: '',
    date: '',
    userInfo: {},
    hasUserInfo: false,
    openid: "",
    dialogShow: false,
    showOneButtonDialog: false,
    oneButton: [{
      text: 'OK'
    }],
    loginStatus: "登录失败"
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onGotUsertInfo: function (e) {
    const that = this
    console.log(e.detail.userInfo.nickName)

    wx.cloud.callFunction({
      name: "login",
      success: res => {

        that.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true,
          openid: res.result.openid,
          dialogShow: true,
          showOneButtonDialog: true,
          loginStatus: "登录成功"
        })
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        that.setData({
          dialogShow: true,
          showOneButtonDialog: true,
          loginStatus: "登录失败"
        })
      }

    })

  },
  onShow: function () {
    var that = this
    var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    var timerID = setInterval(function () {
      var cd = new Date();
      that.setData({
        time: zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2),
        date: zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth() + 1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()]
      })
    }, 1000);

  },

  tapDialogButton: function (e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  }
})

function zeroPadding(num, digit) {
  var zero = '';
  for(var i = 0; i < digit; i++) {
      zero += '0';
  }
  return (zero + num).slice(-digit);
}