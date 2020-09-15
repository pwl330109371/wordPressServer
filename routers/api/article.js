const express = require('express')

const router = express.Router()

const passport = require('passport')     // 验证token

const Article = require('../../moduls/Article')

const Follow = require('../../moduls/Follow')

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
  if (req.body.tagList) acticleFields.tagList = req.body.tagList
   // 插入用户信息
  acticleFields.authorInfo = {
    name: req.user.name,
    id: req.user.id,
    avatar: req.user.avatar
  }
  new Article(acticleFields).save().then(acticle => {
    res.json({
      state: 200,
      msg: '操作成功',
      data: acticle
    })
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
router.post('/list', (req, res) => {
  let pageSize = req.body.pageSize || 20  // 分页参数
  let currentPage = req.body.currentPage || 1 // 当前的页码
  let params = {
    // 查询条件参数
    keyword: req.body.keyword,
    tag: req.body.tag
  }
  let mp = {}
  for (let i in params) {
    if(params[i] != undefined) {
      mp[i] = params[i]
    }
  }
  Article.find()
    .then(acticle => {
      if(!acticle) {
        return res.status(404)
      }
      let count = acticle.length // 数量总长度
      console.log('count', count)
      Article.find({...mp}).sort({'date':-1}).skip((parseInt(currentPage)-1)*parseInt(pageSize)).limit(parseInt(pageSize)).exec((err, docs) => {
        if (err) {
          return res.status(200).json({state: 1,msg: '请求失败'})
        }
        res.json({
          state: 200,
          msg: '操作成功',
          total: count,
          list: docs
        })
      })
    })
    .catch(err => res.status(404).json(err))   
})

// route GET apo/acticle/
// @desc 获取单个的信息
// @access Private
router.get('/detail',passport.authenticate('jwt', {session: false}), (req, res) => {
  Article.findOne({_id: req.query.id})
    .then(acticle => {
      if(!acticle) {
        return res.status(404)
      }
      // Article.updateOne({_id: req.query.id}, {count:count}, (err, data) => {
      //   console.log(data);
      // })
      console.log(acticle.authorInfo.id);

      Follow.find({userId: acticle.authorInfo.id}).then((data) => {
        if (data.length > 0 && data != null) {
          let userId = req.user.id
          let followList = data[0].followList
          followList.indexOf(userId) >= 0 ? acticle.isFollow = true : false
          console.log(acticle.isFollow);
        } else {
          acticle.isFollow = false
        }
        console.log(acticle);
        Article.findByIdAndUpdate({ _id: req.query.id }, { $inc: { count: 1 } }, { new: true, upsert: true }, function (error, counter) {});
        res.json(acticle)
      })

    })
    .catch(err => res.status(404).json(err))
})

// route DELETE apo/acticle/delete
// @desc 获取单个的信息
// @access Private
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const userId = req.user.id
  Article.findByIdAndRemove({_id:req.params.id})
    .then(acticle => {
      acticle.save().then(acticle => res.json(acticle))
      res.status(200).json(acticle)
    })
    .catch(err => res.status(404).json('删除失败'))
})

// route DELETE apo/acticle/delete
// @desc 获取单个的信息
// @access Private
router.get('/myArticle', (req, res) => {
  const userId = req.query.id
  Article.find({ "authorInfo.id": userId })
    .then(acticle => {
      console.log(acticle);
      res.status(200).json(acticle)
    })
    .catch(err => res.status(404).json('删除失败'))
})

module.exports = router