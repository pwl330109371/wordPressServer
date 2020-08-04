
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
const TagChildSchema = new Schema({
  name: {  // 标题
    type: String,
    required: true
  },
  _personId: { // 父亲id
    type: Schema.Types.ObjectId,
  }
},{ _personId: false })

module.exports = tagsChild = mongoose.model('tagsChilds', TagChildSchema)