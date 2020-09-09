//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env:'ftodo-2gwc7',
      traceUser:true
    })
  },
  globalData:{
    userInfo:{}
  }
})
