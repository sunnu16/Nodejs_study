/*
  App - Express convert
      - Express midleWare(bodyParser, compression)
      - Express custom middleware
      - Express static files middleware 
      - Error handler
      - Express.Router
      - Express security
      - Login
      - Express Session
*/


//express 모듈 추가 - const(상수)를 사용하여 재할당 불가능 = 고정
const express = require('express');
const app = express();
var fs = require('fs');
var http = require('http');
var url = require('url');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');

//express-session 미들웨어를 모듈로서 설치
var session = require('express-session');

var FileStore = require('session-file-store')(session);
// -> session-file-store 대신 mysql을 사용하여 저장가능

//static files
app.use(express.static('public')); //정적인 파일을 서비스하고 싶을때, 서비스 하고픈 dir을 직접 지정

//bodyParser middleware 추가 
app.use(bodyParser.urlencoded({extended : false}));

//bodyparser가 만들어내는 middleware를 표현하는 식 - 요청할때마다 middleware가 실행
/* - 데이터를 내가 원하는 형태의 데이터로 ‘가공'하는 과정을 parsing.
     그 과정을 수행하는 모듈 혹은 메소드를 parser 라한다.
   - 클라이언트 POST request data의 body로부터 파라미터를 편리하게 추출 
*/

//compression middleware - 데이터 용량을 압축(gzip)하여 전송하고 압축을 풀어 실행
app.use(compression());

// session middleware
app.use(session({
   
  //key : 'is_logined', //auth.js -> req.session.is_logined 
  secret : 'very&super&secret', //secret 옵션은 필수(단, 실서비스시, 따로 처리해줘야함 노출x)
  resave : false, // session 데이터가 바뀌기 전까지는, 저장소 값을 저장하지 않는다
  saveUninitialized : true, // session이 필요하기 전까지는, session을 구동시키지 않는다
  store : new FileStore() 
  //seessions의 명을 가진 dir를 생성하여 쿠키값을 저장 
  //->사용자가 session id를 가진 상태로 서버 접속 하면 cookie값으로 session id를 전달

})); // 옵션(객체)를 통해 세션의 동작 방법을 바꿀 수 있음


//make middleware - fs.readdir('./data', function(error, filelist){}); 공통된 부분
app.get('*', function(request, response, next){  //'*'은 모든 요청 의미 (여기서는 get 방식의 모든요청)

  fs.readdir('./data', function(error, filelist){
    
    request.list = filelist;
    next();

  });

});


// indexRouter
var indexRouter = require('./routes/index');

// topticRouter
var topicRouter = require('./routes/topic');

// authRouter
var authRouter = require('./routes/auth');


// /index로 시작하는 주소들은 indexRouter라는 middleware을 적용
app.use('/', indexRouter);

// /topic으로 시작하는 주소들은 topicRouter라는 middleware을 적용
app.use('/topic', topicRouter);

// /auth으로 시작하는 주소들은 authRouter라는 middleware을 적용
app.use('/auth', authRouter);


//route, routing - 사용자가 여러 path를 통해 접속할때, 각 path 마다 해당하는 응답을 해주는것


//error 404
app.use(function(request, response, next){

  response.status(404).send('sorry cant find!');

});


//error 500
app.use(function(error, request, response, next){

  console.error(error.stack)
  response.status(500).send('something broke!');

});
/*
  앞서 실행된 내용중 에러가 있을 경우(next로 호출되어 인자가 있는 경우),
  error 500의 미들웨어를 호출 하도록 약속되어있음 
*/


//app.listen(5000, () => console.log('Example app listening on port 5000!'))
app.listen(5000, function(){

  console.log('App listening on port 5000!')

});





/*
var http = require('http');
var url = require('url'); //url 모듈을 사용
var qs = require('querystring'); //querystring 모듈 추가

//template 모듈 추가로 변환
var template = require('./lib/template.js');

//mysql db 연동
var db = require('./lib/db.js');

//topic.js 연동
var topic = require('./lib/topic.js');

//topic.js 연동
var author = require('./lib/author.js');

 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    // home + path가 없는 경로로 접속한다면~
    if(pathname === '/'){
      if(queryData.id === undefined){
        
        topic.home(request, response); //topic.js 

      //id 값을 선택한 경우 page
      } else {

        topic.page(request, response); //topic.js        
      }

    // create page 경로 추가+설정
    } else if(pathname === '/create'){

      topic.create(request, response);    

    // create_process 받기  
    } else if(pathname === '/create_process'){

      topic.create_process(request, response);

    // update 엔드포인트
    } else if(pathname === '/update'){

      topic.update(request, response);

    // update_process를 받을  
    } else if(pathname === '/update_process'){

      topic.update_process(request, response);     

    //delete_process 엔드포인트
    } else if(pathname === '/delete_process'){

      topic.delete_process(request, response);
    
    // author pathname
    } else if(pathname === '/author'){

      author.home(request, response);
     
    // /author/create_process 
    } else if(pathname === '/author/create_process'){

      author.create_process(request, response);

    // /author/update 
    } else if(pathname === '/author/update'){

      author.update(request, response);

    // /author/update_process 
    } else if(pathname === '/author/update_process'){

      author.update_process(request, response);

    // /author/delete_process 
    } else if(pathname === '/author/delete_process'){

      author.delete_process(request, response);

    } else {

      response.writeHead(404);
      response.end('Not found');
    }
    
    
});
app.listen(5000);

*/