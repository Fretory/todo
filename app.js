//app.js
App({
  onLaunch: function () {
    wx.cloud.init({                                                                             
      env:'competition-31da7',
      traceUser:true
    })
  },
  globalData:{
    userInfo:{}
  }
})
