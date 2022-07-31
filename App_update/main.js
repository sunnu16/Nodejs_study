/*App - UPDATE 기능 구현 
      - POST 기능 구현 이후 작업
      + 글 수정, 링크 생성
       (home에서는 update가 보이지 않고, 
        특정 토픽을 선택시에만 update 표시)
      + update endpoint를 querystring을 이용하여 설정
      + update data 전송, 수신 후 처리 (fs.rename)
*/

var http = require('http');
var fs = require('fs');
var url = require('url'); //url 모듈을 사용
var qs = require('querystring'); //querystring 모듈 추가

//templateHTML 함수 return 수정
function templateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>

    ${list}
    ${control}
    ${body}

  </body>
  </html>
  `;
}

//templateList 함수 추가
function templateList(filelist){
  var list = '<ul>';
  //파일 목록 만들기
  //filelist 배열을 이용한 반복 적용
  var i = 0;
  while(i < filelist.length){
    //list의 값에다가 filelist 추가
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + `</ul>`;
  
  return list;
}
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    //path가 없는 경로로 접속한다면~
    if(pathname === '/'){

      //querystring이 있다면 queryData.id이 값이 존재 없다면 존재하지않음(undeined)
      if(queryData.id === undefined){

        //data dir에서 파일 목록을 가져오고, 그 후 nodejs는 funcion 실행 
        fs.readdir('./data', function(error, filelist){
          //console.log(filelist);
          
          //Home
          var title = 'Welcome';
          var description = 'Hello, Node.js - 홈(Web 클릭시 내용 표시)';

          var list =templateList(filelist); //tmeplateList 함수 불러오기
         
          var template = templateHTML(title, list, 
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
            
            ); //templateHTML함수에 title, list
          //제목 부분인 Web -> welcome, 1.html, 2.css, 3.javascript 가 클릭 시 동적 변화주기
          response.writeHead(200);
          response.end(template);
        }) 
        
        //id 값을 선택한 경우 page
      } else {

        fs.readdir('./data', function(error, filelist){
          //console.log(filelist);

          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            
            var title = queryData.id;

            //tmeplateList function 적용  
            var list =templateList(filelist); 
            //templateHTML function 적용
            var template = templateHTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
              
              ); //특정 토픽 선택시, update 링크 표시 + update 엔드포인트 ?id${title}연결
            
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    
    /*create page 경로 추가+설정*/
    } else if(pathname === '/create'){
      
      fs.readdir('./data', function(error, filelist){
        //console.log(filelist);

        var title = 'Site - create';
        var list =templateList(filelist); 
        
        //create 클릭시, 폼 구현
        var template = templateHTML(title, list, `
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
        response.end(template);
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

        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          
          var title = queryData.id;
          //tmeplateList function 적용  
          var list =templateList(filelist); 
          //templateHTML function 적용
          var template = templateHTML(title, list,
            
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
          response.end(template);
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
        })
       
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
