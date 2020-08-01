
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const express = require('express')
const bodyParser = require('body-parser');
const passport = require('passport')
const app = express()



// 引入users.js
const users = require('./routers/api/users')

// 引入users.js
const profile = require('./routers/api/profiles')

// 引入users.js
const article = require('./routers/api/article')

// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }))  
// parse application/json  
app.use(bodyParser.json())  
// 引入users.js

const db = require('./config/key').mongoURI
mongoose.connect(db)
  .then(() => console.log('连接成功！'))
  .catch((err) => console.log(err))

// passport 初始化
app.use(passport.initialize())  

require('./config/passport')(passport)

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/article', article)

const server = app.listen(3000, ()=> {
  let host = server.address().address
  let port = server.address().port
  console.log('应用访问的地址是:http://', host, port);
})