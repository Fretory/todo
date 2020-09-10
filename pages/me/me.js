const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    openid:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onGotUsertInfo:function(e){
    const that=this
    console.log(e.detail.userInfo.avatarUrl)
    wx.cloud.callFunction({
      name:"login",
      success:res=>{
        
        that.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true,
          openid:res.result.openid
        })
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.openid=res.result.openid
      }
    })
  }
})
