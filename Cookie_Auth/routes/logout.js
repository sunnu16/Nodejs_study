//logout

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
  
  //authStatusUI funtion
  function authStatusUI(request, response){
    
    var authStatusUI = '<a href="/login">🎠Login🎠</a>'
    if(authIsOwner(request, response)){
  
      authStatusUI = '<a href="/logout">🔒Logout🔒</a>';
    }
    return authStatusUI;
  }


// /logout
router.get('/', function(request, response){
  // app.get('/', (req, res) => res.send('Hello Express!'))

  var title = 'Logout';
  var list = template.List(request.list); //topics 함수 불러오기
  var html = template.HTML(title,
    
    `
    <form action = "/logout/logout_process" method = "post">
      <h3 style="color:red;">🔥Are you sure you want to log out?🔥</h3>
      <h3 style="color:red; ">👇Check and press the button below👇</h3>  
      <p><input type="submit" value="🔐Logout🔐"></p>
    </form>
    <img src = "/images/coding2.jpg" style = "width:380px; display : block;  margin-top: 10px; margin-bottom: 10px;">
    `,
    `<a href="/topic/create">🌻CREATE🌻</a>`,
    list,
    authStatusUI(request, response)
    //templateHTML함수에 title, list

  );
  
  response.send(html); // writeHead(200)+ end(html)
  
});




// /logout_process
router.post('/logout_process', function(request, response){
    
  var post = request.body; //post에 정보가 입력
  console.log('hi');
   
  response.clearCookie('email');
  response.clearCookie('password');
  response.clearCookie('nickname');
  response.redirect(`/`);
  
  
  //response.cookie('email', '', {maxAge : 0});
  //response.cookie('password', '', {maxAge : 0});
  //response.cookie('nickname', '', {maxAge : 0});
  //response.redirect(`/`);
  
    
  

});


module.exports = router;