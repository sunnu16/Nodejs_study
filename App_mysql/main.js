/*App - Homepage Mysql setting + 구현1
*/

var http = require('http');
var fs = require('fs');
var url = require('url'); //url 모듈을 사용
var qs = require('querystring'); //querystring 모듈 추가

//template 모듈 추가로 변환
var template = require('./lib/template.js');
//path 모듈
var path = require('path');
//sanitizehtml(살균) 모듈
var sanitizehtml =require('sanitize-html');

//mysql 모듈 추가
var mysql = require('mysql');
var db = mysql.createConnection({
  
  host : '15.164.226.103', 
  user : 'root', 
  password : '0000',
  database : 'app_set1' 
});
db.connect(); //접속 

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    //path가 없는 경로로 접속한다면~
    if(pathname === '/'){

      //querystring이 있다면 queryData.id이 값이 존재 없다면 존재하지않음(undeined)
      if(queryData.id === undefined){
        
        /*
        //data dir에서 파일 목록을 가져오고, 그 후 nodejs는 funcion 실행 
        fs.readdir('./data', function(error, filelist){
          //console.log(filelist);
          
          //Home
          var title = 'Welcome';
          var description = 'Hello, Node.js - 홈(Web 클릭시 내용 표시)';

          //template
          var list = template.List(filelist); //tmeplateList 함수 불러오기         
          var html = template.HTML(title, list, 
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
            
            ); //templateHTML함수에 title, list
          //제목 부분인 Web -> welcome, 1.html, 2.css, 3.javascript 가 클릭 시 동적 변화주기
          response.writeHead(200);
          response.end(html);

        }); 
        */

        //topic data 연결 확인
        db.query(`SELECT * FROM topic`, function(error, topics){
          console.log(topics);
          response.writeHead(200);
          response.end('success');
        })

        //id 값을 선택한 경우 page
      } else {

        fs.readdir('./data', function(error, filelist){
          //console.log(filelist);

          //filtered -오염된정보를 쳐낸다
          //path.parse() - 인자를 받아 특정 정보만 포함하는 객체 추출(상위 디렉토리 정보는 삭제) + .base - 네임명만 추출
          var filteredId = path.parse(queryData.id).base;

          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            
            var title = queryData.id;
            
            //sanitizehtml 사용
            var sanitizedTitle = sanitizehtml(title);
            var sanitizedDescription = sanitizehtml(description);

            var list =template.List(filelist);             
            var html = template.HTML(title, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a> 
                <a href="/update?id=${sanitizedTitle}">update</a>
                
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`

              );
               /*특정 토픽 선택시, 
                update 링크 표시 + update 엔드포인트 ?id${title}연결
                delete는 링크x (매우 무모하고 위험한 방식)*/
            
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    
    /*create page 경로 추가+설정*/
    } else if(pathname === '/create'){
      
      fs.readdir('./data', function(error, filelist){
        //console.log(filelist);

        var title = 'Site - create';
        var list =template.List(filelist); 
        
        //create 클릭시, 폼 구현
        var html = template.HTML(title, list, `
        <form action="/create_process" method="post">
        <!--서버에 데이터를 생성 수정 삭제시 -> post,get,update method를 사용-->
        <p><input type ="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
        `, ''); 
        
        response.writeHead(200);
        response.end(html);
      });

      //create_process 받기
    } else if(pathname === '/create_process'){

      var body = '';
      //request.on을 사용하여 data 수신할때마다 function(data){}를 호출
      request.on('data', function(data){
        body = body + data; 
        /*body에다 callback이 실행될 때마다 data를 추가
        (+전송된 data의 크기가 너무 클때, 
          접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지)*/

      });
      //data 수신이 끝났을때
      request.on('end',function(){

        var post = qs.parse(body); //post에 정보가 입력
        var title = post.title;
        var description = post.description;

        fs.writeFile(`data/${title}`, description, 'utf8', function(err){

          response.writeHead(302, {Location:`/?id=${encodeURI(title)}`}); 
          /*302의 뜻은 page를 다른 곳으로 redirect 시켜라
            입력된 data를 파일로 저장후, 해당되는 title page로 이동*/
          response.end();

        })
        /*console.log(post.title); 확인 */

      });

    //update 엔드포인트
    } else if(pathname === '/update'){

      fs.readdir('./data', function(error, filelist){
        //console.log(filelist);

        //path.parse 추가
        var filteredId = path.parse(queryData.id).base;

        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          
          var title = queryData.id;
          //tmeplateList function 적용  
          var list =template.List(filelist); 
          //templateHTML function 적용
          var html = template.HTML(title, list,
            
            `
            <form action="/update_process" method="post">
            <!--서버에 데이터를 생성 수정 삭제시 -> post,get,update method를 사용-->
            
            <input type="hidden" name="id" value="${title}">
            <!--제출(submit) 작동시, 사용자가 수정하는 정보의 파일과 수정되는 파일을 구분-->

            <p><input type ="text" name="title" placeholder="title" value="${title}"></p>
            <!--input 태그의 value을 이용하여 기본값 설정-->
            <p>
                <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>            
            `,

            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            
            ); //특정 토픽 선택시, update 링크 표시 + update 엔드포인트 ?id${title}연결
          
          response.writeHead(200);
          response.end(html);
        });
      });

    //update_process를 받을 
    } else if(pathname === '/update_process'){
      
      var body = '';
      request.on('data', function(data){
        body = body + data; 
        /*body에다 callback이 실행될 때마다 data를 추가
        (+전송된 data의 크기가 너무 클때, 
          접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지)*/

      });
      //data 수신이 끝났을때
      request.on('end',function(){

        var post = qs.parse(body); //post에 정보가 입력
        var id = post.id; //id값 추가
        var title = post.title;
        var description = post.description;
        
        //수정할 예전 파일 이름, 새로운 파일은 기존 data dir의 파일의 이름을 변경, 그 후 callback 함수 실행
        fs.rename(`data/${id}`, `data/${title}`, function(error){

          //내용 변경
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){

            response.writeHead(302, {Location:`/?id=${encodeURI(title)}`}); 
            response.end();
          })
        });
       
      });

      //dete_process 경로
    } else if(pathname === '/delete_process'){
      
      var body = '';
      request.on('data', function(data){
        body = body + data; 
        /*body에다 callback이 실행될 때마다 data를 추가
        (+전송된 data의 크기가 너무 클때, 
          접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지)*/

      });
      //data 수신이 끝났을때
      request.on('end',function(){

        var post = qs.parse(body); //post에 정보가 입력
        var id = post.id; //id값 추가

        //path.parse 추가
        var filteredId = path.parse(id).base;

        //delete file
        fs.unlink(`data/${filteredId}`, function(error){

          response.writeHead(302, {Location:`/`}); 
          response.end(); 
          //삭제 완료시, 홈으로 
        });    
       
      });

    }else {

      response.writeHead(404);
      response.end('Not found');
    }

    //console.log(queryData.id); -> querystring에 따라 다른 정보를 출력 / 확인

    //console.log(url.parse(_url, true).pathname); -> 주어진 _url의 구성 요소 정보 확인

    //file system 중 readfile 사용 - 본문 내용을  다른파일에서 불러오기
 
});
app.listen(5000);
