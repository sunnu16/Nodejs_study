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


// /login_process
router.post('/login_process', function(request, response){
    
  var body = '';
  request.on('data', function(data){

    body = body + data;
    /*body에다 callback이 실행될 때마다 data를 추가
    (+전송된 data의 크기가 너무 클때, 
    접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지) 
    */
  });

  //data 수신이 끝났을때
  request.on('end', function(){

    var post = qs.parse(body); //post에 정보가 입력
    
    //사용자의 이메일 & 패스워드
    if(post.email === 'aaa123@node.com' && post.password ==='12345'){
      response.writeHead(302, {

        'Set-Cookie':[
          `email=${post.email}`,
          `password=${post.password}`,
          `nickname=rich`
        ],
        Location: `/` //로그인을 성공하면 홈으로
      });
      response.end();
      
    } else {
      response.end('Login fail');
    }
           

  });

});


module.exports = router;