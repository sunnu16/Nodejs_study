//query string에 따라서 변환되는 본문 내용 구현

var http = require('http');
var fs = require('fs');
var url = require('url'); //url 모듈을 사용

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title =queryData.id;
    console.log(queryData.id); //querystring에 따라 다른 정보를 출력 / 확인

    if(_url == '/'){
      title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);

    //file system 중 readfile 사용 - 본문 내용을  다른파일에서 불러오기
    fs.readFile(`${queryData.id}`, 'utf8', function(err, description){        
        var template = `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ol>
        <li><a href="/?id=HTML">HTML</a></li> 
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ol>
      <h2>${title}</h2>
      <p>${description}</p>
    </body>
    </html> 
    `;
      //제목 부분인 Web -> welcome, 1.html, 2.css, 3.javascript 가 클릭 시 동적 변화주기

    response.end(template);
    })
    
 
});
app.listen(5000);