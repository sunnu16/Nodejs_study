//App - 글 목록 list 구현

var http = require('http');
var fs = require('fs');
var url = require('url'); //url 모듈을 사용
 
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

          /*
          var list = `<ul>
            <li><a href="/?id=HTML">HTML</a></li> 
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>`;
          */

          var list = '<ul>';

          //파일 목록 만들기
          //filelist 배열을 이용한 반복 적용
          var i = 0;
          while(i < filelist.length){

            //list의 값에다가 filelist 추가
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
          }

          list = list+'</ul>';

          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>

            ${list}

            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
          `;
          //제목 부분인 Web -> welcome, 1.html, 2.css, 3.javascript 가 클릭 시 동적 변화주기
          //response.writeHead(200);
          response.end(template);
        }) 
 
      } else {

        fs.readdir('./data', function(error, filelist){
          console.log(filelist);

          var title = 'Welcome';
          var description = 'Hello, Node.js - 홈(Web 클릭시 내용 표시)';
          
          //if부분과 같은 방식
          var list = '<ul>';
          var i = 0;
          while(i < filelist.length){

            //list의 값에다가 filelist 추가
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
          }
          list = list+'</ul>';

          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            
            var title = queryData.id;
            var template = `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>

              ${list}

              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>
            `;

            response.writeHead(200);
            response.end(template);
          });

        });

      }

    } else {

      response.writeHead(404);
      response.end('Not found');
    }

    //console.log(queryData.id); -> querystring에 따라 다른 정보를 출력 / 확인

    //console.log(url.parse(_url, true).pathname); -> 주어진 _url의 구성 요소 정보 확인

    //file system 중 readfile 사용 - 본문 내용을  다른파일에서 불러오기

 
});
app.listen(5000);
