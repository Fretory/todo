const todoDB = wx.cloud.database().collection('todos')

let addNewTodo = function (todos) {
  return new Promise(function (resolve, reject) {
    todoDB.add({
      data: {
        content: todos,
        done: false,
        date: new Date().toLocaleString()
      },
      success: (res) => {
        let result = res._id;
        console.log(result)
        Promise.resolve(result.data);
      },
      fail: () => {
        Promise.reject("系统异常，请重试！")
      }
    })
  })
}

let queryTodosUndone = function (userOpenID) {
  return new Promise(function (resolve, reject) {
    todoDB.where({
      _openid: userOpenID,
      done: false
    }).orderBy(
      'date', 'desc'
    ).limit(20).get({
      success: (result) => {
        resolve(result.data);
      },
      fail: () => {
        reject("系统异常，请重试！")
      }
    })
  })
}

let queryTodosDone = function (userOpenID) {
  return new Promise(function (resolve, reject) {
    todoDB.where({
      _openid: userOpenID,
      done: true
    }).orderBy(
      'date', 'desc'
    ).limit(100).get({
      success: (result) => {
        resolve(result.data);
      },
      fail: () => {
        reject("系统异常，请重试！")
      }
    })
  })
}


let changeTodo = function (itemID) {
  todoDB.doc(itemID).get({
    success: function (res) {
      let isDone = !res.data.done
      todoDB.doc(itemID).update({
        data: {
          done: isDone
        },
        success: function (res) {
          console.log(res.stats.updated)
        }
      })
    }
  })
}

let deleteTodo = function (itemID) {
  todoDB.doc(itemID).remove({
    success: function (res) {
      console.log(res.stats.removed)
      //成功打印1
    }
  })
}

module.exports = {
  addNewTodo: addNewTodo,
  queryTodosUndone: queryTodosUndone,
  queryTodosDone: queryTodosDone,
  deleteTodo: deleteTodo,
  changeTodo: changeTodo
}