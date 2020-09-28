
/**
 * 创建数据模型
 * schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义；
 * 每个schema会映射到mongodb中的一个collection，它不具备操作数据库的能力
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Schema Types内置类型如下：
 * String, Number, Boolean | Bool, Array, Buffer, Date, ObjectId | Oid, Mixed
*/
const commentSchema = new Schema({
  articleId: { // 文章id
    type: String,
    required: true
  },
  userId: {  // 用户
    type: String,
    required: true
  },
  userName: {  // 用户名称
    type: String,
    required: true
  },
  content: { // 内容
    type: String,
    required: true
  },
  date: { // 时间
    type: Date,
    default: Date.now
  }
})

module.exports = comment = mongoose.model('comment', commentSchema, 'comment')