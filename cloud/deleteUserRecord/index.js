// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let status=false;
  try {
    return await db.collection('todos').where({
      _openid: event.openid
    }).remove()
    status=true
  } catch(e) {
    console.error(e)
    status=false
  }
  return status;
}