const express = require('express')

const router = express.Router()

const passport = require('passport')     // 验证token

const Profile = require('../../moduls/Profile')

// route GET apo/profile/test
// @desc 返回请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'profile works!'
  })
})

// route POST apo/profile/add
// @desc 返回请求的json数据
// @access Private
router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
  const profileFields = {};
  if (req.body.type) profileFields.type = req.body.type
  if (req.body.describe) profileFields.describe = req.body.describe
  if (req.body.income) profileFields.income = req.body.income
  if (req.body.expend) profileFields.expend = req.body.expend
  if (req.body.cash) profileFields.cash = req.body.cash
  if (req.body.remark) profileFields.remark = req.body.remark
  new Profile(profileFields).save().then(profile => {
    res.json(profile)
  })
})

// route POST apo/profile/add
// @desc 编辑数据
// @access Private
router.put('/edit', passport.authenticate('jwt', {session: false}), (req, res) => {
  const profileFields = {};
  if (req.body.type) profileFields.type = req.body.type
  if (req.body.describe) profileFields.describe = req.body.describe
  if (req.body.income) profileFields.income = req.body.income
  if (req.body.expend) profileFields.expend = req.body.expend
  if (req.body.cash) profileFields.cash = req.body.cash
  if (req.body.remark) profileFields.remark = req.body.remark
  Profile.findOneAndUpdate(
    {_id: req.body.id},   //编辑_id 为 req.params.id 的数据
    {$set: profileFields},  //要编辑的内容
    {new: true}
  ).then(profile => res.status(200).json(profile))
  .catch(err => res.status(400).json(err))
})

// route GET api/profile/list
// @desc 获取所有的信息
// @access Private
router.get('/list', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.find()
    .then(profile => {
      if(!profile) {
        return res.status(404)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))   
})

// route GET apo/profile/
// @desc 获取单个的信息
// @access Private
router.get('/detail', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({_id: req.query.id})
    .then(profile => {
      if(!profile) {
        return res.status(404)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))   
})

// route DELETE apo/profile/delete
// @desc 获取单个的信息
// @access Private
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

  Profile.findByIdAndRemove({_id:req.params.id})
    .then(profile => {
      profile.save().then(profile => res.json(profile))
      res.status(200).json(profile)
    })
    .catch(err => res.status(404).json('删除失败'))   
})
module.exports = router