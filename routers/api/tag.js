/*
 * @文件描述: 文件描述
 * @作者: pwl
 * @Date: 2020-09-25
 * @LastEditors: pwl
 * @LastEditTime: 2020-10-12
 */
const express = require('express')

const router = express.Router()

const passport = require('passport')     // 验证token

const Tag = require('../../moduls/Tag')

const TagChild = require('../../moduls/TagChild')


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
  const tags = {};
  if (req.body.name) tags.name = req.body.name
  new Tag(tags).save().then(tag => {
    res.json(tag)
  })
})

// route POST api/acticle/add
// @desc 返回请求的json数据
// @access Private
router.post('/addChild', passport.authenticate('jwt', {session: false}), (req, res) => {
  const tags = {};
  if (req.body.name) tags.name = req.body.name || req.query.name
  if (req.body._personId) tags._personId = req.body._personId || req.query._personId
  new TagChild(tags).save().then(tag => {
    res.json(tag)
  })
})


// route GET api/acticle/list
// @desc 获取所有的信息
// @access Private
router.post('/list', (req, res) => {
  Tag.find()
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

// route GET api/acticle/list
// @desc 获取所有的信息
// @access Private
router.get('/getTagChildList', (req, res) => {
  TagChild.find({_personId:req.query.personId})
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