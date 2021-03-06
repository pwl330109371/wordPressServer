const express = require('express')

const router = express.Router()

const passport = require('passport')     // 验证token

const Praise = require('../../moduls/Praise')

const Article = require('../../moduls/Article')


// route GET api/floow/test
// @desc 返回请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'follow works!'
  })
})

// route POST api/follow/addPraise
// @desc 点赞
// @access Private
router.post('/addPraise', passport.authenticate('jwt', {session: false}), (req, res) => {
// router.post('/isFollow', (req, res) => {

  // Praise.remove({articleId: req.body.articleId})
  const praiseObj = {};
  if (req.body.articleId) praiseObj.articleId = req.body.articleId // 点赞的文章ID
  if (req.user.id) praiseObj.userId = req.user.id // 当前用户自己的id
  console.log(req.user.id);
  let articleId = req.body.articleId
  praiseObj.praiseList = new Array()
  praiseObj.praiseList.push(articleId)
  Praise.find({userId: req.user.id}).then((data) => {
    console.log('res', data);
    if(data != null && data.length > 0) {
      const praiseList = data[0].praiseList
      let inx = praiseList.indexOf(req.body.articleId)
      if(inx < 0) {
        praiseList.push(req.body.articleId)
        Praise.update({userId: req.user.id},{$set:{'praiseList': praiseList}}).then(()=>{
        Article.findByIdAndUpdate({ _id: req.body.articleId }, { $inc: { praiseCount: 1 } }, { new: true, upsert: true }, function (error, counter) {})
        res.json({
          state: 200,
          msg: '操作成功！'
        })
        //  Article.findByIdAndUpdate({ _id: req.body.articleId }, { $inc: { praiseCount: 1 } }, { new: true, upsert: true }, function (error, counter) {}).then(() => {
        //   res.json({
        //     state: 200,
        //     msg: '操作成功！'
        //   })
        //  })

        })
      } else {
        // 存在
        res.json({
          state: 200,
          msg: '已点赞！'
        })
      }
    } else {
      new Praise(praiseObj).save().then(praiseObj => {
        Article.findByIdAndUpdate({ _id: req.body.articleId }, { $inc: { praiseCount: 1 } }, { new: true, upsert: true }, function (error, counter) {})
        res.json(praiseObj)
      })
    }
  })
})

// route POST api/follow/canclFollow
// @desc 取消点赞
// @access Private
router.post('/canclPraise', passport.authenticate('jwt', {session: false}), (req, res) => {
  // router.post('/isFollow', (req, res) => {
  
    const articleId = req.body.articleId // 当前文章发布者的id
    const userId =  req.user.id // 用户自己的id
    Praise.find({userId: userId}).then((data) => {
      console.log('res', data);
      if(data != null && data.length > 0) {
        const praiseList = data[0].praiseList
        let inx = praiseList.indexOf(articleId)
        if(inx >= 0) {
          // console.log(praiseList.splice(inx, 1));
          praiseList.splice(inx, 1)
          console.log('newpraiseList', praiseList);
          
          Praise.updateOne({userId: userId},{$set:{'praiseList':praiseList}}).then(() => {
            Article.findByIdAndUpdate({ _id: req.body.articleId }, { $inc: { praiseCount: -1 } }, { new: true, upsert: true }, function (error, counter) {});
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

      }
    })
  })

  // route get api/Favorite/list
// @desc 返回请求的json数据
// @access Private
router.get('/isPraise', passport.authenticate('jwt', {session: false}), (req, res) => {
  let userId = req.user.id
  let articleId = req.query.articleId
  Praise.find({userId: userId}).then((result) => {
    if(result.length > 0) {
       let praiseList = result[0].praiseList
      let inx = praiseList.indexOf(articleId)
      if(inx >= 0) {
        res.json({
            state: 200,
            data: {
                state:1
            }
        })
      } else {
        res.json({
            state: 200,
            data: {
                state:2
            }
        })
      }
    } else {
      res.json({
          state: 200,
          data: {
              state:2
          }
      })
    }
  })
})


// route get api/follow/list
// @desc 返回请求的json数据
// @access Private
router.get('/myPraise', (req, res) => {
  let userId = req.query.userId
  Praise.find({userId: userId}).then((result) => {
    console.log(result);
    if(result.length === 0) {
      res.json({
        state: 200,
        data: []
      })
      return
    }
    let praiseList = result[0].praiseList 
    if (praiseList.length === 0) {
      res.json({
        state: 200,
        data: []
      })
      return
    }
    Article.find({ _id: { $in: praiseList } }).then((data) => {
      res.json({
        state: 200,
        data: data
      })
    }).catch(error => {
      console.log(error);
    })


  })
})



module.exports = router