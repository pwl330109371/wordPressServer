const express = require('express')

const router = express.Router()

const passport = require('passport')     // 验证token

const Follow = require('../../moduls/Follow')

const User = require('../../moduls/User')

// route GET api/floow/test
// @desc 返回请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'follow works!'
  })
})

// route POST api/follow/addFollow
// @desc 关注
// @access Private
router.post('/addFollow', passport.authenticate('jwt', {session: false}), (req, res) => {
// router.post('/isFollow', (req, res) => {

  const followObj = {};
  const authorId = req.body.authorId // 当前文章发布者的id
  const userId =  req.body.userId // 用户自己的id
  followObj.followList = new Array()
  followObj.followList.push(authorId)

  Follow.remove({}).then((res) => {
    console.log(res);
  })
  Follow.find({userId: userId}).then((data) => {
    console.log('res', data);
    if(data != null && data.length > 0) {
      const followList = data[0].followList
      let inx = followList.indexOf(authorId)
      if(inx < 0) {
        followList.push(authorId)
        Follow.update({userId: userId},{$set:{'followList':followList}}).then(()=>{
          res.json({
            state: 200,
            msg: '操作成功！'
          })
        })
      } else {
        // 存在
        res.json({
          state: 200,
          msg: '已关注！'
        })
      }
      console.log(inx);
    } else {
      new Follow(followObj).save().then(followObj => {
        res.json(followObj)
      })
    }
  })
})

// route POST api/follow/canclFollow
// @desc 取消关注
// @access Private
router.post('/canclFollow', passport.authenticate('jwt', {session: false}), (req, res) => {
  // router.post('/isFollow', (req, res) => {
  
    const authorId = req.body.authorId // 当前文章发布者的id
    const userId =  req.body.userId // 用户自己的id
    Follow.find({userId: userId}).then((data) => {
      console.log('res', data);
      if(data != null && data.length > 0) {
        const followList = data[0].followList
        let inx = followList.indexOf(userId)
        if(inx >= 0) {
          // console.log(followList.splice(inx, 1));
          followList.splice(inx, 1)
          console.log('newFollowList', followList);
          
          Follow.updateOne({userId: userId},{$set:{'followList':followList}}).then(() => {
            res.json({
              state: 200,
              msg: '操作成功！'
            })
          })
        } else {
          // 存在
          res.json({
            state: 200,
            msg: '操作失败！'
          })
        }
      } else {
        // new Follow(followObj).save().then(followObj => {
        //   res.json(followObj)
        // })
      }
    })
  })

// route get api/follow/list
// @desc 返回请求的json数据
// @access Private
router.get('/myFollow', passport.authenticate('jwt', {session: false}), (req, res) => {
  Follow.find({userId:req.user.id}).then((result) => {
    console.log(result);
    let followList = result[0].followList
    if(followList.length === 0) {
      res.json({
        state: 200,
        data: followList
      })
      return
    }
    User.find({ _id: { $in: followList } }).then((data) => {
      res.json({
        state: 200,
        data: data
      })
    }).catch(error => {
      console.log(error);
    })
  })
})

// 2020-04-02

// 2020-08-25
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

/**
 * 
 * 
 * 
*/

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