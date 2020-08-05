
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
const ArticleSchema = new Schema({
  title: {  // 标题
    type: String,
    required: true
  },
  author: { // 作者
    type: String,
    required: true
  },
  tagList: { // 标签
    type: Array,
    required: true
  },
  authorInfo: { // 作者信息
    type: Object,
    required: true
  },
  articleImg: { // 封面
    type: String,
  },
  describe: { // 描述
    type: String
  },
  content: {  // 内容
    type: String,
    required: true,
  },
  date: { // 时间
    type: Date,
    default: Date.now
  }
})

module.exports = article = mongoose.model('articles', ArticleSchema)