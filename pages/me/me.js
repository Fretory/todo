const app = getApp()
var dbHelper = require("../../utils/dbOperations")

Page({
  data: {
    time: '',
    date: '',
    userInfo: {},
    hasUserInfo: false,
    openid: "",
    dialogShow: false,
    showOneButtonDialog: false,
    showTwoButtonDialog: false,
    oneButton: [{
      text: 'OK'
    }],
    loginStatus: "登录失败",
    texts: '',
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    error: ''
  },
  //事件处理函数
  egg: function () {
    wx.navigateTo({
      url: '../egg/egg'
    })
  },
  test: function () {

    var original = dbHelper.queryTodosDone("0987653")
    var cast = Promise.resolve(original);
    cast.then(function (value) {
      console.log(value)
      //这里放异步的请求
      //例如增加一个记录
    });
  },
  onGotUsertInfo: function (e) {
    const that = this
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
          loginStatus: "登录失败",
          error:'登录失败'
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
  },
  quitLogin: function (e) {
    const that = this
    this.setData({
      dialogShow: false,
      time: '',
      date: '',
      userInfo: {},
      hasUserInfo: false,
      openid: "",
      dialogShow: false,
      showOneButtonDialog: false,
      error:'退出成功'
    })
  },
  deleteAllTodos: function (e) {
    if (this.openid == '') {
      return
    }
    this.setData({
      showTwoButtonDialog: true
    })
  },
  tapDialogClearButton: function (e) {
    var that=this
    if (e.detail.index == 1) {
      wx.cloud.callFunction({
        name: 'deleteUserRecord',
        data: {
          openid: this.openid
        },
        success: function (res) {

          that.setData({
            error:'删除成功'
          })
        },
        fail: function(res){
          that.setData({
            error:'删除失败'
          })
        }
      })
    }
    this.setData({
      showTwoButtonDialog: false
    })
  }
})

function zeroPadding(num, digit) {
  var zero = '';
  for (var i = 0; i < digit; i++) {
    zero += '0';
  }
  return (zero + num).slice(-digit);
}