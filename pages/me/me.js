const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    openid:"",
    dialogShow: false,
    showOneButtonDialog:false,
    oneButton: [{text: 'OK'}],
    loginStatus:"登录失败"
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
          openid:res.result.openid,
          dialogShow: true,
          showOneButtonDialog: true,
          loginStatus:"登录成功"
        })
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.openid=res.result.openid
      },
      fail:err=>{
        that.setData({
          dialogShow: true,
          showOneButtonDialog: true,
          loginStatus:"登录失败"
        })
      }
      
    })

  },

  tapDialogButton:function(e){
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  }
})
