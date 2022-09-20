// Home

//express를 다시 로딩
var express = require('express');
//express.Router() 호출시, router 객체를 리턴
var router = express.Router();

var http = require('http');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var fs = require('fs');
var cookie = require('cookie');
var cookieParser = require('cookie-parser')

var template = require('../lib/template.js');


//cookie 체크 function
function authIsOwner(request, response){
  
  var isOwner = false;
  var cookies = {}

  if(request.headers.cookie){ //쿠키값이 없다면 undefinde
  
    cookies = cookie.parse(request.headers.cookie);
  }
  //console.log(cookies); //입력되는 쿠키값 확인하기
  
  if(cookies.email === 'aaa123@node.com' && cookies.password === '12345'){
    isOwner = true;
  }
  return isOwner;
  //console.log(isOwner);

}


// app.get('/', (req, res) => res.send('Hello Express!'))
router.get('/', function(request, response){


  //cookie 값 체크
  var isOwner = authIsOwner(request, response);
  console.log(isOwner);
  
  var title = 'Welcome';
  var description = 'Hello, Node.js & Express - HOME';
  var list = template.List(request.list); //topics 함수 불러오기
  var html = template.HTML(title, list,
    
    `
    <h2>${title}</h2>${description}
    <img src = "/images/hello.jpg" style = "width:500px; display : block; margin-top: 10px;">
    `,
    `<a href="/topic/create">🌻CREATE🌻</a>`
    //templateHTML함수에 title, list

  );
   
  response.send(html); // writeHead(200)+ end(html)
    
});

module.exports = router;