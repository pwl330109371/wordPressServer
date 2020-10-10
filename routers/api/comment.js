const express = require('express')

const router = express.Router()

const passport = require('passport')     // 验证token

const Comment = require('../../moduls/Comment')


// route GET api/acticle/test
// @desc 返回请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'Article works!'
  })
})

// route POST api/acticle/add
// @desc 返回请求的json数据
// @access Private
router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
  const comment = {};
  let userId = req.user.id
  let userName =req.user.name
  if (req.body.articleId) comment.articleId = req.body.articleId
  if (req.body.content) comment.content = req.body.content
  comment.userId = userId
  comment.userName = userName
  new Comment(comment).save().then(data => {
    res.json(data)
  })
})

// route GET api/acticle/list
// @desc 获取所有的信息
// @access Private
router.get('/list', (req, res) => {
    const articleId = req.query.articleId
    Comment.find({articleId: articleId}).sort({'date':-1})
    .then(tags => {
      if(!tags) {
        return res.status(404)
      }
        res.json({
            state: 200,
            msg: '操作成功',
            data: tags
        })

    })
    .catch(err => res.status(404).json(err))   
})


module.exports = router