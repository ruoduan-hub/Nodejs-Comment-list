var http = require('http')

var fs = require('fs')

var template = require('art-template')

var url = require('url')


var comments = [
  {
    name:'张三',
    message:'哈哈',
    dateTime:'2018/1/1'
  },
  {
    name:'李四',
    message:'阿四分管',
    dateTime:'2018/1/1'
  },
  {
    name:'王五',
    message:'哈你好啊',
    dateTime:'2018/1/1'
  },
]
http
  .createServer(function(req,res){
    var parseObj = url.parse(req.url,true)
 // 使用 url.parse 方法将路径解析为一个方便操作的对象，第二个参数为 true 表示直接将查询字符串转为一个对象（通过 query 属性来访问）
    
 pathname = parseObj.pathname
// 单独获取不包含查询字符串的路径部分（该路径不包含 ? 之后的内容）
    if (pathname === '/') {
      fs.readFile('./views/index.html',function(err,data){
        if (err) {
          return console.log('readFile not')
        }
        //用template 渲染模板字符串
        var htmlStr = template.render(data.toString(), {
          comments: comments
        })
        //返回 渲染后data
        res.end(htmlStr)
      })
    }else if (pathname === '/post'){
      fs.readFile('./views/post.html',function(err,data){
        if (err) {
          return res.end('404 not file')
        }
        res.end(data)
      })

    } else if (pathname.indexOf('/public/') === 0) {
      
    fs.readFile('.' + pathname,function(err,data){
        if (err) {
          return res.end('404 not found')
        }
        res.end(data)
      })
    } else if (pathname === '/pinglun') {
       var comment = parseObj.query
       console.log(parseObj.query);
       
       comment.dateTime = '2018/12/22'
       comments.push(comment)
      // 服务端这个时候已经把数据存储好了，接下来就是让用户重新请求 / 首页，就可以看到最新的留言内容了
		
		//重定向
       res.statusCode = 302
       res.setHeader('Location','/')
       res.end()

    } else {
      //其他的 请求都处理成404 页面
      fs.readFile('./views/404.html',function(err,data){
        if (err) {
          return res.end('404 not page')
        }
        res.end(data)
      })
    }

})
.listen(3000,function(){
  console.log('running......')
})