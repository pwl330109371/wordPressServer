

**用户类目管理
登录接口:    http://localhost:3000/api/users/login
请求方式:    POST
参数        用户名：name   密码：password
例          name:'admin'  password: 123456


获取用户列表 http://localhost:3000/api/users/list
请求方式:    GET


删除用户 http://localhost:3000/api/users/delete/:id
请求方式:    DELETE
参数         用户id:id
例          http://localhost:3000/api/users/delete/:5f7428176fcb6b2769e51949


文章类目管理
文章列表：   http://localhost:3000/api/article/list
请求方式：   POST
参数        分页参数：pageSize    当前页码：currentPage
例          pageSize:10  currentPage: 1

发布文章：   http://localhost:3000/api/article/add
请求方式：   POST
参数：
  *标题：title
  描述：describe
  *作者：author
  封面图片：articleImg
  *内容：content
  *标签：tagList
例    title:'文章标题'  describe: '文章描述'  author:'文章作者'  封面图片:'xxx.png'  content:'内容'   标签:['5f5c67671d93cbaa5aa3af7b'](多个用逗号分割)


删除文章：   http://localhost:3000/api/article/delete/:id
请求方式：   DELETE
参数        文章id：id
例          http://localhost:3000/api/article/delete/:5f7428176fcb6b2769e51949



**标签分类管理

一级标签添加：http://localhost:3000/api/tag/add
请求方式：   POST       
参数        类目名称：name
例          name:'后端'

二级标签添加：http://localhost:3000/api/tag/addChild
请求方式：   POST        
参数        类目名称：name  一级标签id: _personId
例          name:'后端'   _personId:_personId

获取一级标签列表：http://localhost:3000/api/tag/list
请求方式：   POST    

根据一级标签获取二级标签列表：http://localhost:3000/api/tag/getTagChildList
请求方式：   GET    
参数         一级标签id: _personId
例           _personId:_personId

**图片上传接口 : http://localhost:3000/api/file/uploadImg
请求方式：   POST
参数         file:'上传的文件'    