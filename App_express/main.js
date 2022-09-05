/*
  App - Express convert
      - Express midleWare
*/


//express 모듈 추가 - const(상수)를 사용하여 재할당 불가능 = 고정
const express = require('express');
const app = express();

var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');
var template = require('./lib/template.js');

//bodyParser middleware 추가 
app.use(bodyParser.urlencoded({extended : false}));
//bodyparser가 만들어내는 middleware를 표현하는 식 - 요청할때마다 middleware가 실행
/* 데이터를 내가 원하는 형태의 데이터로 ‘가공'하는 과정을 parsing.
   그 과정을 수행하는 모듈 혹은 메소드를 parser 라한다.*/
/* 클라이언트 POST request data의 body로부터 파라미터를 편리하게 추출 */

//compression middleware - 데이터 용량을 압축(gzip)하여 전송하고 압축을 풀어 실행
app.use(compression());


//route, routing - 사용자가 여러 path를 통해 접속할때, 각 path 마다 해당하는 응답을 해주는것



// Home

// app.get('/', (req, res) => res.send('Hello Express!'))
app.get('/', function(request, response){

  fs.readdir('./data', function(error, filelist){
    
    var title = 'Welcome';
    var description = 'Hello, Node.js & Express - HOME (Web 클릭시 내용 표시)';
    var list = template.List(filelist); //topics 함수 불러오기
    var html = template.HTML(title, list,

      `<h2>${title}</h2>${description}`,
      `<a href="/create">🌻CREATE🌻</a>`
      //templateHTML함수에 title, list

    );
    
    response.send(html); // writeHead(200)+ end(html)
  });

});


// page detail view
app.get('/page/:pageId', function(request, response){

  fs.readdir('./data', function(error, filelist){

    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(error, description){

      var title = request.params.pageId; //db topic id값의 title
      var sanitizeTitle = sanitizeHtml(title); //db topic id값의 description
      var sanitizeDescription = sanitizeHtml(description, {

        allowedTags:['h1']
      });

      var list = template.List(filelist); //topics 함수 불러오기
      var html = template.HTML(sanitizeTitle, list,
          
        `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
        ` <a href="/create">🌻CREATE🌻</a><br><br>
            <a href="/update/${sanitizeTitle}">💡UPDATE💡</a><br><br>
            <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizeTitle}">
                <input type="submit" value="🔥delete🔥">
            </form>`

      ); //templateHTML함수에 title, list
      response.send(html);

    });
  });
});

//response.send(request.params);  app.get('/page/:pageId' -> {"pageId":"HTML(data)"} 표현

// /create
app.get('/create', function(request, response){
  fs.readdir('./data', function(error, filelist){
                  
    var title = 'Create';
    var list = template.List(filelist); //topics 함수 불러오기
    var html = template.HTML(title, list, //template.js author 불러오기
      `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit" value="🔥submit🔥">
        </p>
      </form>
      `,
      `<a href="/create">🌻CREATE🌻</a>`
    );

    response.send(html);
  });

});


// /create_process
app.post('/create_process', function(request, response){
  
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

  */
  //request.body
  var post = request.body;
  var title = post.title;
  var description = post.description;

  fs.writeFile(`data/${title}`, description, 'utf8', function(error){

    response.writeHead(302, {Location: `/?id=${title}`});
    response.end();

  })

});


// /update
app.get('/update/:pageId', function(request, response){

  fs.readdir('./data', function(error, filelist){

    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(error, description){
            
      var title = request.params.pageId;
      //tmeplateList function 적용
      var list = template.List(filelist); //topics 함수 불러오기
      var html = template.HTML(title, list,
        `
        <form action="/update_process" method="post">
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

        `<a href="/create">🌻CREATE🌻</a> <a href="/update?id=${title}">💡UPDATE💡</a>`
      ); //특정 토픽 선택시, update 링크 표시 + update 엔드포인트 ?id${title}연결

      response.send(html);

    });

  });
  
});


// /update_process
app.post('/update_process', function(request, response){

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

  */

  var post = request.body; //post에 정보가 입력
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
      
    fs.writeFile(`data/${title}`, description, 'utf8', function(error){
                
      //express redirect
      response.redirect(`/?id=${title}`);

    });

  });

});


// /delete
app.post('/delete_process', function(request, response){

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
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      
      //response.writeHead(302, {Location: `/`});
      //response.end();

      //express redirect
      response.redirect('/');

    })       

  });

  */
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    
    //express redirect
    response.redirect('/');
  });

});


//app.listen(5000, () => console.log('Example app listening on port 5000!'))
app.listen(5000, function(){

  console.log('Example app listening on port 5000!')

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