
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
const favoriteSchema = new Schema({
  userId: {  // 用户
    type: String,
    required: true
  },
  favoriteList: { // 收藏的列表
    type: Array,
    default: []
  }
})

module.exports = favorite = mongoose.model('favorite', favoriteSchema, 'favorite')