const express = require('express')

const router = express.Router()

const passport = require('passport')     // 验证token

const Favorite = require('../../moduls/Favorite')

const Article = require('../../moduls/Article')

// route GET api/floow/test
// @desc 返回请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'Favorite works!'
  })
})

// route POST api/Favorite/addFavorite
// @desc 收藏
// @access Private
router.post('/addFavorite', passport.authenticate('jwt', {session: false}), (req, res) => {
// router.post('/isFavorite', (req, res) => {
  const FavoriteObj = {};
  FavoriteObj.userId = req.user.id // 当前用户自己的id
  FavoriteObj.favoriteList = new Array()
  FavoriteObj.favoriteList.push(req.body.articleId)

  Favorite.find({userId: req.user.id}).then((data) => {
    console.log('res', data);
    if(data != null && data.length > 0) {
      const FavoriteList = data[0].favoriteList
      console.log();
      if(FavoriteList.length > 0) {
        let inx = FavoriteList.indexOf(req.body.articleId)

        if(inx < 0) {
          FavoriteList.push(req.body.articleId)
          Favorite.update({userId: req.user.id},{$set:{'favoriteList':FavoriteList}}).then(()=>{
            res.json({
              state: 200,
              msg: '操作成功！'
            })
          })
        } else {
          // 存在
          res.json({
            state: 200,
            msg: '已收藏！'
          })
        }
        console.log(inx);
      }
 
    } else {
      new Favorite(FavoriteObj).save().then(FavoriteObj => {
        res.json(FavoriteObj)
      })
    }
  })
})

// route POST api/Favorite/canclFavorite
// @desc 取消收藏
// @access Private
router.post('/canclFavorite', passport.authenticate('jwt', {session: false}), (req, res) => {
  // router.post('/isFavorite', (req, res) => {
  
    const userId = req.user.id // 当前文章发布者的id
    const articleId =  req.body.articleId // 用户自己的id
    Favorite.find({userId: userId}).then((data) => {
      console.log('res', data);
      if(data != null && data.length > 0) {
        const FavoriteList = data[0].FavoriteList
        let inx = FavoriteList.indexOf(articleId)
        if(inx >= 0) {
          // console.log(FavoriteList.splice(inx, 1));
          FavoriteList.splice(inx, 1)
          console.log('newFavoriteList', FavoriteList);
          
          Favorite.updateOne({userId: req.user.id},{$set:{'FavoriteList':FavoriteList}}).then(() => {
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
        // new Favorite(FavoriteObj).save().then(FavoriteObj => {
        //   res.json(FavoriteObj)
        // })
      }
    })
  })

// route get api/Favorite/list
// @desc 返回请求的json数据
// @access Private
router.get('/isFavorite', passport.authenticate('jwt', {session: false}), (req, res) => {
    let userId = req.user.id
    let articleId = req.query.articleId
    Favorite.find({userId: userId}).then((result) => {
      if(result.length > 0) {
         let favoriteList = result[0].favoriteList
        let inx = favoriteList.indexOf(articleId)
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

// route get api/Favorite/list
// @desc 返回请求的json数据
// @access Private
router.get('/myFavorite', passport.authenticate('jwt', {session: false}), (req, res) => {
  Favorite.find({userId: req.user.id}).then((result) => {
    console.log(result);
    let favoriteList = result[0].favoriteList
    if(favoriteList.length === 0) {
      res.json({
        state: 200,
        data: []
      })
      return
    }
    Article.find({ _id: { $in: favoriteList } }).then((data) => {
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