const express = require('express')
const router = express.Router()

const fs = require("fs")
const path = require("path")


// route GET api/acticle/test
// @desc 返回请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'Article works!'
  })
})

// 图片上传
router.post('/upload', (req, res) => {
  let time = Date.now()
  console.log(req.files[0]);
  
  var des_file = path.resolve() + `/public/upload/${time}` + req.files[0].originalname;
  fs.readFile( req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if( err ){
        console.log( err );
      } else{
        response = {
          code: 200,
          msg: '操作成功',
          filename: time + '' + req.files[0].originalname
        }
      }
      res.status(200).json(response)
    })
  })
})



module.exports = router