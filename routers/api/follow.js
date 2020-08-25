const express = require('express')

const router = express.Router()

const passport = require('passport')     // 验证token

const Follow = require('../../moduls/Follow')


// route GET api/floow/test
// @desc 返回请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'follow works!'
  })
})

// route POST api/follow/addFollow
// @desc 返回请求的json数据
// @access Private
router.post('/isFollow', passport.authenticate('jwt', {session: false}), (req, res) => {
// router.post('/isFollow', (req, res) => {

  const followObj = {};
  if (req.body.type) followObj.type = req.body.type // 1是关注  2 是取消关注
  if (req.body.userId) followObj.userId = req.body.authorId // 当前用户自己的id
  followObj.followList = new Array()
  followObj.followList.push(req.body.userId)

  // Follow.find({userId: followObj.userId}).then((res) => {
  //   console.log('res', res);
  //   if(res != null && res.length > 0) {
  //     res.indexOf()
  //   }
  // })
  new Follow(followObj).save().then(followObj => {
    res.json(followObj)
  })
})

// // route POST api/acticle/add
// // @desc 返回请求的json数据
// // @access Private
// router.post('/addChild', passport.authenticate('jwt', {session: false}), (req, res) => {
//   const tags = {};
//   if (req.body.name) tags.name = req.body.name
//   if (req.body._personId) tags._personId = req.body._personId
//   new TagChild(tags).save().then(tag => {
//     res.json(tag)
//   })
// })


// // route GET api/acticle/list
// // @desc 获取所有的信息
// // @access Private
// router.post('/list', (req, res) => {
//   Tag.find()
//     .then(tags => {
//       if(!tags) {
//         return res.status(404)
//       }
// 			res.json({
// 					state: 200,
// 					msg: '操作成功',
// 					data: tags
// 			})

//     })
//     .catch(err => res.status(404).json(err))   
// })

// // route GET api/acticle/list
// // @desc 获取所有的信息
// // @access Private
// router.get('/getTagChildList', (req, res) => {
//   TagChild.find({_personId:req.query.personId})
//     .then(tags => {
//       if(!tags) {
//         return res.status(404)
//       }
// 			res.json({
// 					state: 200,
// 					msg: '操作成功',
// 					data: tags
// 			})

//     })
//     .catch(err => res.status(404).json(err))   
// })


module.exports = router