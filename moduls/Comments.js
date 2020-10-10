
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
    __v: {
        type: Number,
        select: false
    },
    commentator: {  // 用户
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {  // 内容
        type: String,
        required: true
    },
    questionId: { // 文章
        type: String,
        required: true
    },
    answerId: { // 评论谁
        type: String,
        required: true
    }
})

module.exports = Comment = mongoose.model('Comment', commentSchema, 'favorite')