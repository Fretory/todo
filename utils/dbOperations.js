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
        resolve(result);
      },

      fail: () => {
        reject("系统异常，请重试！")
      }

    })
  })
}
export default addNewTodo;