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
        Promise.resolve(result);
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
module.exports = {
  addNewTodo: addNewTodo,
  queryTodosUndone: queryTodosUndone,
  queryTodosDone: queryTodosDone
}