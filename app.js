
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const express = require('express')
const bodyParser = require('body-parser');
const passport = require('passport')
const app = express()
const multer  = require('multer')


// 引入users.js
const users = require('./routers/api/users')

// 引入profile.js
const profile = require('./routers/api/profiles')

// 引入article.js
const article = require('./routers/api/article')

// 引入upload.js
const upload = require('./routers/api/upload')

// 引入tag.js
const tag = require('./routers/api/tag')

// 引入follow.js
const follow = require('./routers/api/follow')

// 引入praise.js
const praise = require('./routers/api/praise')

// favorite.js
const favorite = require('./routers/api/favorite')

// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }))  
// parse application/json  
app.use(bodyParser.json())

// 静态资源托管
app.use(express.static("./public"))

// 上传图片插件
app.use(multer({dest:'./public/uploads'}).array('file'))


const db = require('./config/key').mongoURI
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true // 这个即是报的警告
})
  .then(() => console.log('连接成功！'))
  .catch((err) => console.log(err))

// passport 初始化
app.use(passport.initialize())  

require('./config/passport')(passport)

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/article', article)
app.use('/api/file', upload)
app.use('/api/tag', tag)
app.use('/api/follow', follow)
app.use('/api/praise', praise)
app.use('/api/favorite', favorite)

const server = app.listen(3000, ()=> {
  let host = server.address().address
  let port = server.address().port
  console.log('应用访问的地址是:http://', 'localhost', port);
})