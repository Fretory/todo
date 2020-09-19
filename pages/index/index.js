//index.js
var dbHelper = require("../../utils/dbOperations")
const todoDB = wx.cloud.database().collection('todos')
//获取应用实例
const app = getApp()
Page({
  data: {
    newTask: "",
    taskList: [],
    pagesize:0, 
    dialogShow:false,
    oneButton: [{text: '确定'}],
    content:"",
    date:"",
    openid:"",

    colorArr:[
      "linear-gradient(90deg, rgba(231,228,80,0.9766349899334734) 2%, rgba(123,254,112,1) 100%);",
      "linear-gradient(90deg, rgba(231,80,80,0.9766349899334734) 2%, rgba(255,255,255,1) 100%);",
      "linear-gradient(90deg, rgba(208,201,4,0.9766349899334734) 2%, rgba(255,255,255,1) 100%);",
      "linear-gradient(90deg, rgba(4,192,208,0.9766349899334734) 2%, rgba(255,255,255,1) 100%);",
      "linear-gradient(90deg, rgba(245,100,136,0.9766349899334734) 2%, rgba(255,255,255,1) 100%);",
      "linear-gradient(90deg, rgba(245,244,100,0.9766349899334734) 2%, rgba(255,255,255,1) 100%);",
      "linear-gradient(90deg, rgba(146,103,174,0.9766349899334734) 5%, rgba(255,255,255,1) 100%);",
    ],
    randomColorArr: []
  },
  onLoad: function () {
    const that = this
      let labLen = that.data.taskList.length,
      colorArr = that.data.colorArr,
      colorLen = colorArr.length,
      ranlen = that.data.randomColorArr.length,
      randomColorArr = that.data.randomColorArr;
      labLen = labLen - ranlen
  //判断执行
  do{
    let random = colorArr[Math.floor(Math.random() * colorLen)];
    randomColorArr.unshift(random);
    labLen--;
  } while (labLen > 0)
  
  that.setData({ 
    randomColorArr: randomColorArr
  });


  },

  btnCloseInfo:function(){
    this.setData({
      dialogShow: false
  })
  },
  btnGetInfo:function(e){
    this.setData({
      dialogShow: true,
      content: e.currentTarget.dataset.content,
      date : e.currentTarget.dataset.date
  })
},
  btnGetInfo:function(){
  },
  onShow: function () {
    this.setData({
      openid:app.globalData.openid
    })
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
            var original = dbHelper.queryTodosUndone(app.globalData.openid)
            var cast = Promise.resolve(original);
            cast.then(function (value) {
              //that.onLoad(value)
              that.taskList = value
              that.setData({
                taskList: value,
                pagesize: 0 
              })
            });
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
           var original = dbHelper.queryTodosUndone(app.globalData.openid)
           var cast = Promise.resolve(original);
           cast.then(function (value) {
             //that.onLoad(value)
             that.taskList = value
             that.setData({
               taskList: value,
               pagesize: 0 
             })
           });
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
      this.onLoad()
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