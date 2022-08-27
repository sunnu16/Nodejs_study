/*App - Mysql setting
      + Mysql C.R.U.D view 구현
      + Mysql join + detail view
      + Mysql join + Create detail view
      + Mysql join + Update detail view
      + Total cleanup
      + Author 추가
      + security add sanitizeHtml 
*/

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

    //home + path가 없는 경로로 접속한다면~
    if(pathname === '/'){
      if(queryData.id === undefined){
        
        topic.home(request, response); //topic.js 

      //id 값을 선택한 경우 page
      } else {

        topic.page(request, response); //topic.js        
      }

    /*create page 경로 추가+설정*/  
    } else if(pathname === '/create'){

      topic.create(request, response);    

    //create_process 받기  
    } else if(pathname === '/create_process'){

      topic.create_process(request, response);

    //update 엔드포인트
    } else if(pathname === '/update'){

      topic.update(request, response);

    //update_process를 받을  
    } else if(pathname === '/update_process'){

      topic.update_process(request, response);     

    //delete_process 엔드포인트
    } else if(pathname === '/delete_process'){

      topic.delete_process(request, response);
    
    //author pathname
    } else if(pathname === '/author'){

      author.home(request, response);
     
    /* //author/create_process */ 
    } else if(pathname === '/author/create_process'){

      author.create_process(request, response);

    /* /author/update */
    } else if(pathname === '/author/update'){

      author.update(request, response);

    /* /author/update_process */
    } else if(pathname === '/author/update_process'){

      author.update_process(request, response);

    /* /author/delete_process */
    } else if(pathname === '/author/delete_process'){

      author.delete_process(request, response);

    } else {

      response.writeHead(404);
      response.end('Not found');
    }
    
    
});
app.listen(5000);