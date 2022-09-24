//Express session example

/*
    현대 애플리케이션에서는 쿠키로는 사용자 식별자 구별용으로 사용,
    실제 데이터는 서버에 저장하여 구현하는 것이 세션 방법

    쿠키와 세션을 사용하는 이유?
    HTTP 프로토콜의 특징이자 약점(Connectionless 프로토콜 (비연결 지향), Stateless 프로토콜)을 보완하기 위해서 사용


    쿠키 : 사용자가 web site를 이용시, 이용한 web site의 서버에서 사용자의 pc(브라우저)에 저장하는 데이터 조각
            ex) 방문했던 사이트에 다시 방문 하였을 때 아이디와 비밀번호 자동 입력

    세션 : 일정 시간 동안 사용자(브라우저)로부터 들어오는 요구를 하나의 상태로 보고, 그 상태를 유지시키는 기술 
            -> 사용자가 웹 사이트에 접속해 있는 동안(휘발성)
            ex)  로그인 후, 로그인이 풀리지 않고 로그아웃하기 전까지 유지
    
    차이점 : 
            저장 위치 - 쿠키는 사용자의 pc(브라우저), 세션은 웹 서버
            보안 -  세션이 더 우수
            만료 시점 - 쿠키 : 브라우저가 종료되도, 만료시점이 지나지 않으면 자동삭제x
                        세션 : 브라우저 종료시 삭제

*/


var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
  
var app = express()
  
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
  
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }
  
  // get the url pathname
  var pathname = parseurl(req).pathname
  
  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  
  next()
})
  
app.get('/foo', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})
  
app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})
 
app.listen(5000, function(){
    console.log('5000!');
});