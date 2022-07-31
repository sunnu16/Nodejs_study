/*App 
- (create)글쓰기 화면 생성 
+ post 이용한 data 받기
+ post로 받은 data를 dir에 파일의 형태로 저장(fs.writeFile)
+ 저장된 data를 redirect를 이용한 page 출력
*/

var http = require('http');
var fs = require('fs');
var url = require('url'); //url 모듈을 사용
var qs = require('querystring'); //querystring 모듈 추가

//templateHTML 함수 return 수정
function templateHTML(title, list, body){
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
    <a href="/create">create</a>
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

          var title = 'Welcome';
          var description = 'Hello, Node.js - 홈(Web 클릭시 내용 표시)';

          var list =templateList(filelist); //tmeplateList 함수 불러오기
         
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`); //templateHTML함수에 title, list
          //제목 부분인 Web -> welcome, 1.html, 2.css, 3.javascript 가 클릭 시 동적 변화주기
          response.writeHead(200);
          response.end(template);
        }) 
 
      } else {

        fs.readdir('./data', function(error, filelist){
          //console.log(filelist);

          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            
            var title = queryData.id;

            //tmeplateList function 적용  
            var list =templateList(filelist); 
            //templateHTML function 적용
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    
    /*create 경로 추가+설정*/
    } else if(pathname === '/create'){
      
      fs.readdir('./data', function(error, filelist){
        //console.log(filelist);

        var title = 'Site - create';
        var list =templateList(filelist); 
        
        //create 클릭시, 폼 구현
        var template = templateHTML(title, list, `
        <form action="http://localhost:5000/create_process" method="post">
        <!--서버에 데이터를 생성 수정 삭제시 -> post,get method를 사용-->
        <p><input type ="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
        `); 
        
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

          response.writeHead(302,{Location : `/?id=${title}`}); 
          /*302의 뜻은 page를 다른 곳으로 redirect 시켜라
            입력된 data를 파일로 저장후, 해당되는 title page로 이동*/
          response.end();

        })
        /*console.log(post.title); 확인 */

      });



    } else {

      response.writeHead(404);
      response.end('Not found');
    }

    //console.log(queryData.id); -> querystring에 따라 다른 정보를 출력 / 확인

    //console.log(url.parse(_url, true).pathname); -> 주어진 _url의 구성 요소 정보 확인

    //file system 중 readfile 사용 - 본문 내용을  다른파일에서 불러오기

 
});
app.listen(5000);
