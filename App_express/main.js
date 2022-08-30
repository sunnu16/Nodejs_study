/*App - Mysql add
      + Mysql C.R.U.D view 구현 + Mysql join
      + Total cleanup
      + Author C.R.U.D추가
      + security add sanitizeHtml 
      + Express
*/


//express 모듈 추가 - const(상수)를 사용하여 재할당 불가능 = 고정
const express = require('express')
const app = express()
var fs = require('fs');
var template = require('./lib/template.js');
 
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

app.get('/page', function(req, res){

  return res.send('/page <- page path')

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