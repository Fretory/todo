//index.js
var dbHelper = require("../../utils/dbOperations")
const todoDB = wx.cloud.database().collection('todos')
//获取应用实例
const app = getApp()
Page({
  data: {
    newTask: "",
    taskList: [],
    pagesize:0
  },
  onLoad: function () {
    //查询
  },
  onShow: function () {
    const that = this
    var original = dbHelper.queryTodosUndone(app.globalData.openid)
    var cast = Promise.resolve(original);
    cast.then(function (value) {
      //that.onLoad(value)
      that.taskList = value
      that.setData({
        taskList: value,
        pagesize: 0 
      })
      //console.log(that.taskList)
    });

  },
  btnHaveDone: function (e) {
    //console.log(e.currentTarget.dataset.id)
    var that = this
    todoDB.doc(e.currentTarget.dataset.id).get({
      success: function (res) {
        let isDone = !res.data.done
        todoDB.doc(e.currentTarget.dataset.id).update({
          data: {
            done: isDone
          },
          success: (res) => {
            //console.log(res.stats.updated)
            that.onShow()
          }
        })

      }
    })        
   
  },
  btnDelete: function (e) {
    var that = this
    todoDB.doc(e.currentTarget.dataset.id).remove({
      success: function (res) {
        console.log(res.stats.removed)
        //成功打印1
        that.onShow()
      }
    })
  },
  btnAddCard: function () {
    todoDB.add({
      data: {
        content: this.newTask,
        done: false,
        date: new Date().toLocaleString()
      },
      success: (res) => {
        let result = res._id;
        console.log(result)
        this.onShow()
        this.setData({
              'newTask': ''
           })
      }
    })
},
onReachBottom:function(){
  let page = this.data.pagesize + 20
  todoDB.where({
    _openid: app.globalData.openid,
    done: false
  }).orderBy(
    'date', 'desc'
  ).limit(20).skip(page).get({
    success: (result) => {
      let old_data = this.data.taskList
      let new_data = result.data
      this.setData({
        taskList : old_data.concat(new_data),
        pagesize : page
      })
    }
    })
},
bindInput(e) {
  let dataset = e.detail.value
  this.newTask = dataset
  this.setData({
    newTask: dataset
  })
}
})