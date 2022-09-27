//auth.js

//express를 다시 로딩
var express = require('express');
//express.Router() 호출시, router 객체를 리턴
var router = express.Router();

var path = require('path');
var fs = require('fs');
var cookie = require('cookie');
var cookieParser = require('cookie-parser')
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');



//user id, pwd, nickname 실제 서비스에선 사용x 공부목적으로 구현
var authData = {
  email:'aaa123@express.com',
  password:'12345',
  nickname:'Super Rich'
}


// /login
router.get('/login', function(request, response){

  var title = 'LOGIN';
  var list = template.List(request.list); //topics 함수 불러오기
  var html = template.HTML(title, list, //template.js author 불러오기
    `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="e-mail"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="🔑LOGIN🔑">
      </p>
      <img src = "/images/coding2.jpg" style = "width:500px; display : block; margin-top: 10px;">
    </form>
    `,
    `<a href="/topic/create">🌻CREATE🌻</a>`
    
  );

  response.send(html);

});

// /login_process
router.post('/login_process', function(request, response){
             
  var post = request.body;
  var email = post.email;
  var password = post.pwd;

  if(email === authData.email && password === authData.password){
    
    request.session.is_logined = true;
    request.session.nickname = authData.nickname; //session store에 기록(메모리에 저장된 세션data를 저장소에 반영하는 작업)
    //console.log(request.session.nickname);

    request.session.save(function(){
      
      response.redirect(`/`);

    }); //session store에 기록하는 작업속도보다 redirect가 훨씬 빨리 끝나기 때문에 session객체에 save
    
    
    
    //login success
    //response.send('Login success!');
  } else {

    //login fail
    response.send('Login fail!');
  }
  
  

}); 





/*
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

//topic list, create, update 로그인시, logout UI


// /create
router.get('/create', function(request, response){

  //접근 제어
  if(authIsOwner(request, response) === false){

    response.end('Login Required!!');
    return false;
  } //로그인 상태가 아니면 다음으로 넘어가지 않도록
                    
  var title = 'Create';
  var list = template.List(request.list); //topics 함수 불러오기
  var html = template.HTML(title, list, //template.js author 불러오기
    `
    <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit" value="🔥submit🔥">
      </p>
    </form>
    `,
    `<a href="/topic/create">🌻CREATE🌻</a>`,
    authStatusUI(request, response)
  );

  response.send(html);

});


// /create_process
router.post('/create_process', function(request, response){
  
  /*
  var body = '';

  //request.on을 사용하여 data 수신할때마다 function(data){}를 호출
  request.on('data', function(data){  

      body = body + data;
        body에다 callback이 실행될 때마다 data를 추가
      (+전송된 data의 크기가 너무 클때, 
      접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지)

  });

  //data 수신이 끝났을때
  request.on('end', function(){
              
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;

    fs.writeFile(`data/${title}`, description, 'utf8', function(error){
      response.writeHead(302, {Location: `/?id=${title}`});
      response.end();

    })     

  }); 
  

  //접근 제어
  if(authIsOwner(request, response) === false){

    response.end('Login Required!!');
    return false;
  } //로그인 상태가 아니면 다음으로 넘어가지 않도록

  var post = request.body;
  var title = post.title;
  var description = post.description;

  fs.writeFile(`data/${title}`, description, 'utf8', function(error){

    //response.writeHead(302, {Location: `/?id=${title}`});
    //response.end();
    response.redirect(`/topic/${title}`);

  })

});


// /update
router.get('/update/:pageId', function(request, response){

  //접근 제어
  if(authIsOwner(request, response) === false){

    response.end('Login Required!!');
    return false;
  } //로그인 상태가 아니면 다음으로 넘어가지 않도록
  
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(error, description){
          
    var title = request.params.pageId;
    //tmeplateList function 적용
    var list = template.List(request.list); //topics 함수 불러오기
    var html = template.HTML(title, list,
      `
      <form action="/topic/update_process" method="post">
      <!--서버에 데이터를 생성 수정 삭제시 -> post,get,update method를 사용-->

        <input type="hidden" name="id" value="${title}">
        <!--제출(submit) 작동시, 사용자가 수정하는 정보의 파일과 수정되는 파일을 구분-->
      
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <!--input 태그의 value을 이용하여 기본값 설정-->
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit" value="🔥submit🔥">
        </p>
      </form>
      `,

      `<a href="/topic/create">🌻CREATE🌻</a> <a href="/topic/update/${title}">💡UPDATE💡</a>`,
      authStatusUI(request, response)
    ); //특정 토픽 선택시, update 링크 표시 + update 엔드포인트 ?id${title}연결

    response.send(html);

  });
  
});


// /update_process
router.post('/update_process', function(request, response){

  /*
  var body = '';
  request.on('data', function(data){
    
    body = body + data;
      body에다 callback이 실행될 때마다 data를 추가
    (+전송된 data의 크기가 너무 클때, 
    접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지) 

  });

  //data 수신이 끝났을때
  request.on('end', function(){
        
    var post = qs.parse(body); //post에 정보가 입력
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){

      fs.writeFile(`data/${title}`, description, 'utf8', function(error){
        

        //response.writeHead(302, {Location: `/?id=${title}`});
        //response.end(); 

        //express redirect
        response.redirect(`/?id=${title}`);

      });     

    });  

  });

  

  //접근 제어
  if(authIsOwner(request, response) === false){

    response.end('Login Required!!');
    return false;
  } //로그인 상태가 아니면 다음으로 넘어가지 않도록

  var post = request.body; //post에 정보가 입력
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
      
    fs.writeFile(`data/${title}`, description, 'utf8', function(error){
                
      //express redirect
      response.redirect(`/topic/${title}`);

    });

  });

});


// /delete
router.post('/delete_process', function(request, response){
  
  //접근 제어
  if(authIsOwner(request, response) === false){

    response.end('Login Required!!');
    return false;
  } //로그인 상태가 아니면 다음으로 넘어가지 않도록

  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    
    //express redirect
    response.redirect('/');
  });

});


// page detail view
router.get('/:pageId', function(request, response, next){

  //접근 제어
  if(authIsOwner(request, response) === false){

    response.end('Login Required!!');
    return false;
  } //로그인 상태가 아니면 다음으로 넘어가지 않도록
  
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(error, description){

    //erro handling
    if(error){

      next(error);

    } else{
      
      var title = request.params.pageId; //db topic id값의 title
      var sanitizeTitle = sanitizeHtml(title); //db topic id값의 description
      var sanitizeDescription = sanitizeHtml(description, {
        
        allowedTags:['h1']
      });

      var list = template.List(request.list); //topics 함수 불러오기
      var html = template.HTML(sanitizeTitle, list,
          
        `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
        ` <a href="/topic/create">🌻CREATE🌻</a><br><br>
          <a href="/topic/update/${sanitizeTitle}">💡UPDATE💡</a><br><br>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizeTitle}">
            <input type="submit" value="🔥delete🔥">
          </form>`,
          authStatusUI(request, response)

      ); //templateHTML함수에 title, list
      response.send(html);

    }

  });
  
});

//response.send(request.params);  app.get('/page/:pageId' -> {"pageId":"HTML(data)"} 표현
*/


module.exports = router;