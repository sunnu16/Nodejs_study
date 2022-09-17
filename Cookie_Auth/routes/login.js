// login

//express를 다시 로딩
var express = require('express');
//express.Router() 호출시, router 객체를 리턴
var router = express.Router();

var template = require('../lib/template.js');
var qs = require('querystring');

// app.get('/', (req, res) => res.send('Hello Express!'))
router.get('/', function(request, response){
    
    var title = 'Login';
    var list = template.List(request.list); //topics 함수 불러오기
    var html = template.HTML(title,
  
      `
      <form action = "login_process" method = "post">
        <p><input type="text" name="eail" placeholder="e-mail"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit" value="🔑LOGIN🔑"></p>
      </form>
      <img src = "/images/coding.jpg" style = "width:380px; display : block;  margin-top: 10px; margin-bottom: 10px;">
      `,
      `<a href="/topic/create">🌻CREATE🌻</a>`,
      list
      //templateHTML함수에 title, list
  
    );
    
    response.send(html); // writeHead(200)+ end(html)
    
  });

  module.exports = router;