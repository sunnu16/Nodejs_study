/*App - Mysql setting
      + Mysql C.R.U.D view 구현
      + Mysql join + detail view
      + Mysql join + Create detail view
      + Mysql join + Update detail view
      + Total cleanup
*/

var http = require('http');
var url = require('url'); //url 모듈을 사용
var qs = require('querystring'); //querystring 모듈 추가

//template 모듈 추가로 변환
var template = require('./lib/template.js');

//mysql 모듈 추가
var mysql = require('mysql');

//mysql 연동
var db = require('./lib/db');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    //path가 없는 경로로 접속한다면~
    if(pathname === '/'){
      if(queryData.id === undefined){
        db.query(`SELECT * FROM topic`, function(error,topics){
          
          var title = 'Welcome';
          var description = 'Hello, Node.js - 홈(Web 클릭시 내용 표시)';
          var list = template.List(topics); //topics 함수 불러오기
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
            //templateHTML함수에 title, list

          );
          response.writeHead(200);
          response.end(html);

        });

        //id 값을 선택한 경우 page
      } else {

        //mysql> SELECT * FROM topic WHERE id = 1;
        db.query(`SELECT * FROM topic`, function(error,topics){
          
          //topic i값 가져오기 실패시
          if(error){

            throw error; //에러가 있을시, 다음으로 넘어가지 않고 에러를 콘솔에 표현 + 중지
          }
          //topic & author JOIN 
          db.query(`SELECT * FROM topic JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic){

            //id=?`, [queryData.id] <- id=${queryData.id} 보다 안전하고,  id=?가 자동으로 [queryData.id]를 치환해줌                
          
            if(error2){
              throw error2;
            }

            //console.log(toopic.title); <- 결과값(배열) 확인           
            var title = topic[0].title; //db topic id값의 title
            var description = topic[0].description; //db topic id값의 description
            var list = template.List(topics); //topics 함수 불러오기
            var html = template.HTML(title, list,
            `<h2>${title}</h2>${description} <p>by ${topic[0].name}</p>`,
            `<a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>`

            ); //templateHTML함수에 title, list
            response.writeHead(200);
            response.end(html);

          })

        });
      }

    /*create page 경로 추가+설정*/  
    } else if(pathname === '/create'){

      db.query(`SELECT * FROM topic`, function(error,topics){

        //mysql db author 불러오기
        db.query(`SELECT * FROM author`, function(error2, authors){
          
          var title = 'Create';
          var list = template.List(topics); //topics 함수 불러오기
          var html = template.HTML(title, list, //template.js author 불러오기
            `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a>`
        ); //templateHTML함수에 title, list

        response.writeHead(200);
        response.end(html);
        });
        
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
      request.on('end', function(){
        
        var post = qs.parse(body);

        //INSERT INTO topic(title, description, created, author_id) VALUES('example', 'create ex...', NOW(), 1);
        db.query(`

          INSERT INTO topic (title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`,
          [post.title, post.description, post.author], 
          function(error, result){

            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();

          }
        )

      });

    //update 엔드포인트
    } else if(pathname === '/update'){

      db.query('SELECT * FROM topic', function(error, topics){
      //fs.readdir('./data', function(error, filelist){
        //console.log(filelist);
        
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }

          db.query(`SELECT * FROM author`, function(error2, authors){

            //tmeplateList function 적용  
            var list = template.List(topics);
            //templateHTML function 적용
            var html = template.HTML(topic[0].title, list,            
              `
              <form action="/update_process" method="post">
              <!--서버에 데이터를 생성 수정 삭제시 -> post,get,update method를 사용-->
  
                <input type="hidden" name="id" value="${topic[0].id}">
                <!--제출(submit) 작동시, 사용자가 수정하는 정보의 파일과 수정되는 파일을 구분-->
              
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <!--input 태그의 value을 이용하여 기본값 설정-->
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
  
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
              ); //특정 토픽 선택시, update 링크 표시 + update 엔드포인트 ?id${title}연결
  
            response.writeHead(200);
            response.end(html);
          });
        //fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          
          
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
      request.on('end', function(){

        var post = qs.parse(body); //post에 정보가 입력                             

        //mysql update
        db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function(error, result){

          response.writeHead(302, {Location: `/?id=${post.id}`});
          response.end();

        })

      });

    //delete_process 엔드포인트
    } else if(pathname === '/delete_process'){

      var body = '';
      request.on('data', function(data){
        
        body = body + data;
        /*body에다 callback이 실행될 때마다 data를 추가
        (+전송된 data의 크기가 너무 클때, 
          접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지)*/
      });
      //data 수신이 끝났을때
      request.on('end', function(){

        var post = qs.parse(body); //post에 정보가 입력
        
        //mysql delete
        db.query('DELETE FROM topic WHERE id =?',[post.id], function(error, result){

          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();

        });

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