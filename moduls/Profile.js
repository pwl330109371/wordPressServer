
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
const ProfileSchema = new Schema({
  type: {
    type: String
  },
  describe: { // 描述
    type: String
  },
  income: { //收入
    type: String,
    require: true
  },
  expend: { // 支出
    type: String,
    require: true
  },
  cash: {
    type: String
  },
  remak: {  // 备注
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = prçofile = mongoose.model('profiles', ProfileSchema)