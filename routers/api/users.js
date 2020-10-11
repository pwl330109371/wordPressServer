const express = require('express')

const router = express.Router()

const bcrypt = require('bcrypt')         // 密码加密。解密的中间件
const gravatar = require('gravatar')     // 生成默认头像的中间件
const jwt = require('jsonwebtoken')      // 生成token的中间件
const keys = require('../../config/key')  
const passport = require('passport')     // 验证token

const User = require('../../moduls/User')

// route GET apo/users/test
// @desc 返回请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'login works!'
  })
})

router.post('/register', (req, res) => {
  console.log(req.body)
  User.findOne({'name':req.body.name})
      .then((user) => {
        if(user) {
          return res.status(200).json({state:400,msg: '账号已被注册！'})
        } else {

          const avatar = gravatar.url(req.body.name, {s: '200', r: 'pg', d:'mm'})
          const newUser = new User({
            name: req.body.name,
            password: req.body.password,
            identity: req.body.identity,
            avatar
          })
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err
              newUser.password = hash
              
              newUser.save()
                     .then(user => res.json({state:200,user}))
                     .catch(err => console.log(err))
                // Store hash in your password DB.
            });
          });
        }
      })
})

// route POST apo/users/list
// @desc 返回token jwt passport
// @access public
router.get('/list',(req, res) => {
  User.find({}).then((user) => {
    res.json({
      data:user
    })
  })
})

// route POST apo/users/list
// @desc 返回token jwt passport
// @access public
router.delete('/delete/:id',(req, res) => {
  User.findByIdAndRemove({_id:req.params.id})
    .then(user => {
      User.save().then(user => res.json(user))
      res.status(200).json(user)
    })
    .catch(err => res.status(404).json('删除失败'))
})

// route POST apo/users/logon
// @desc 返回token jwt passport
// @access public
router.post('/login', (req, res) => {
  
  const name = req.body.name || req.query.name
  const password = req.body.password || req.query.password
  // 查询数据库
  User.findOne({name})
      .then((user) => {
        console.log(user)
        if(!user) {
          return res.status(200).json({state:404,msg: '用户不存在！'})
        }

        // 密码匹配
        bcrypt.compare(password, user.password)
              .then(isMatch => {
                if(isMatch) {
                  const rule = {
                    id: user.id, 
                    name: user.name,        //姓名
                    avatar: user.avatar,    //头像
                    identity: user.identity //身份
                  }
                  // jwt.sign('规则', '加密名字', '过期时间', '箭头函数')
                  jwt.sign(rule, keys.secretOrkey, {expiresIn: 36000}, (err, token) =>{
                    if(err) throw err
                    res.json({
                      success: true,
                      state: 200,
                      userId: user.id,
                      token: 'Bearer ' + token  // 名字一定要是Bearer 才能生效
                    })
                  })
                  // res.json({msg: 'success'})
                } else {
                  return res.status(200).json({state:400,msg: '密码错误！'})
                }
              })
      })
})

// route GET apo/users/current
// @desc return current user
// @access private
// 验证token 返回用户信息
router.get('/current', (req, res) => {
  User.findOne({_id: req.query.userId}).then((data) => {
    console.log('data', data);
    res.json(data)
  }).catch(err => {
    console.log(err);
  })
})



module.exports = router