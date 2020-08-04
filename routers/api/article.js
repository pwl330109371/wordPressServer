const express = require('express')

const router = express.Router()

const passport = require('passport')     // 验证token

const Article = require('../../moduls/Article')

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
  const acticleFields = {};
  if (req.body.title) acticleFields.title = req.body.title
  if (req.body.describe) acticleFields.describe = req.body.describe
  if (req.body.author) acticleFields.author = req.body.author
  if (req.body.articleImg) acticleFields.articleImg = req.body.articleImg
  if (req.body.content) acticleFields.content = req.body.content
   // 插入用户信息
  acticleFields.authorInfo = {
    name: req.user.name,
    id: req.user.id,
    avatar: req.user.avatar
  }
  new Article(acticleFields).save().then(acticle => {
    res.json(acticle)
  })
})

// route POST apo/acticle/add
// @desc 编辑数据
// @access Private
router.put('/edit', passport.authenticate('jwt', {session: false}), (req, res) => {
  const acticleFields = {};
  if (req.body.title) acticleFields.title = req.body.title
  if (req.body.describe) acticleFields.describe = req.body.describe
  if (req.body.author) acticleFields.author = req.body.author
  if (req.body.articleImg) acticleFields.articleImg = req.body.articleImg
  if (req.body.content) acticleFields.content = req.body.content
  Article.findOneAndUpdate(
    {_id: req.body.id},   //编辑_id 为 req.params.id 的数据
    {$set: acticleFields},  //要编辑的内容
    {new: true}
  ).then(acticle => res.status(200).json(acticle))
  .catch(err => res.status(400).json(err))
})

// route GET api/acticle/list
// @desc 获取所有的信息
// @access Private
router.get('/list', (req, res) => {
  Article.find()
    .then(acticle => {
      if(!acticle) {
        return res.status(404)
      }
      res.status(200).json(acticle)
    })
    .catch(err => res.status(404).json(err))   
})

// route GET apo/acticle/
// @desc 获取单个的信息
// @access Private
router.get('/detail', passport.authenticate('jwt', {session: false}), (req, res) => {
  Article.findOne({_id: req.query.id})
    .then(acticle => {
      if(!acticle) {
        return res.status(404)
      }
      res.json(acticle)
    })
    .catch(err => res.status(404).json(err))   
})

// route DELETE apo/acticle/delete
// @desc 获取单个的信息
// @access Private
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

  Article.findByIdAndRemove({_id:req.params.id})
    .then(acticle => {
      acticle.save().then(acticle => res.json(acticle))
      res.status(200).json(acticle)
    })
    .catch(err => res.status(404).json('删除失败'))   
})
module.exports = router