// login

/*해당 로그인 구현은 cookie를 공부하기 위한 목적이며, 보안상 문제가 많아 실제 사용 x*/

//express를 다시 로딩
var express = require('express');
//express.Router() 호출시, router 객체를 리턴
var router = express.Router();

var http = require('http');
var url = require('url');
var cookie = require('cookie');
var path = require('path');
var qs = require('querystring');
var fs = require('fs');
var bodyParser = require('body-parser');

var template = require('../lib/template.js');


// /login
router.get('/', function(request, response){
  // app.get('/', (req, res) => res.send('Hello Express!'))

  var title = 'Login';
  var list = template.List(request.list); //topics 함수 불러오기
  var html = template.HTML(title,
    
    `
    <form action = "/login/login_process" method = "post">
      <p><input type="text" name="email" placeholder="email"></p>
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


// /login_process
router.post('/login_process', function(request, response){
  
  var post = request.body; //post에 정보가 입력
    
  //사용자의 이메일 & 패스워드
  if(post.email === 'aaa123@node.com' && post.password === '12345'){
        
    response.cookie('email', `${post.email}`, {maxAge : 900000});
    response.cookie('password', `${post.password}`, {maxAge : 900000});
    response.cookie('nickname', 'superRich', {maxAge : 900000});
    response.redirect(`/`);
   
    /*
    response.writeHead(302, {

      'Set-Cookie':[
        `email=${post.email}`,
        `password=${post.password}`,
        `nickname=rich`
      ],      
      Location: `/` //로그인을 성공하면 홈으로
    }); 
    response.send();
    */
    
    
  } else {
    //로그인 실패시
    response.send('Login fail');
  }
  
  //});

});


module.exports = router;