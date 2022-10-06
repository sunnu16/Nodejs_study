//topic.js

//express를 다시 로딩
var express = require('express');
//express.Router() 호출시, router 객체를 리턴
var router = express.Router();

var path = require('path');
var fs = require('fs');
var cookie = require('cookie');
var cookieParser = require('cookie-parser')
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
//url 모듈을 사용
var url = require('url'); 
//querystring 모듈 추가
var qs = require('querystring');

//mysql db 연동
var db = require('../lib/db.js');

var template = require('../lib/template.js');
var auth = require('../lib/auth.js');
const { page } = require('../../App_mysql_end/lib/topic.js');



// /create
router.get('/create', function(request, response){

  //접근 제어
  if(!auth.IsOwner(request, response)){ //소유자가 아니라면 홈으로 튕기게

    response.redirect(`/`); 
    return false; //false를 사용하여 다음으로 넘어가지 않게 끊기
  }
                    
  var title = 'Create';
  var list = template.List(request.list); //topics 함수 불러오기
  var html = template.HTML(title, list, //template.js author 불러오기
    `
    <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit" value="🔥submit🔥">
      </p>
    </form>
    `,
    `<a href="/topic/create">🌻CREATE🌻</a>`,
    auth.StatusUI(request, response) //login status 추가
    
  );

  response.send(html);

});


// /create_process
router.post('/create_process', function(request, response){
  
  
  //접근 제어
  if(!auth.IsOwner(request, response)){ //소유자가 아니라면 홈으로 튕기게

    response.redirect(`/`); 
    return false; //false를 사용하여 다음으로 넘어가지 않게 끊기
  }

  var post = request.body;
  var title = post.title;
  var description = post.description;

  fs.writeFile(`data/${title}`, description, 'utf8', function(error){

    //response.writeHead(302, {Location: `/?id=${title}`});
    //response.end();
    response.redirect(`/topic/${title}`);

  })

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


});


// /update
router.get('/update/:pageId', function(request, response){

  //접근 제어
  if(!auth.IsOwner(request, response)){ //소유자가 아니라면 홈으로 튕기게

    response.redirect(`/`); 
    return false; //false를 사용하여 다음으로 넘어가지 않게 끊기
  }
  
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(error, description){
          
    var title = request.params.pageId;
    //tmeplateList function 적용
    var list = template.List(request.list); //topics 함수 불러오기
    var html = template.HTML(title, list,
      `
      <form action="/topic/update_process" method="post">
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

      `<a href="/topic/create">🌻CREATE🌻</a> <a href="/topic/update/${title}">💡UPDATE💡</a>`,
      auth.StatusUI(request, response) //login status 추가
      
    ); //특정 토픽 선택시, update 링크 표시 + update 엔드포인트 ?id${title}연결

    response.send(html);

  });
  
});


// /update_process
router.post('/update_process', function(request, response){


  //접근 제어
  if(!auth.IsOwner(request, response)){ //소유자가 아니라면 홈으로 튕기게

    response.redirect(`/`); 
    return false; //false를 사용하여 다음으로 넘어가지 않게 끊기
  }

  var post = request.body; //post에 정보가 입력
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
      
    fs.writeFile(`data/${title}`, description, 'utf8', function(error){
                
      //express redirect
      response.redirect(`/topic/${title}`);

    });

  });


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


});


// /delete
router.post('/delete_process', function(request, response){

  //접근 제어
  if(!auth.IsOwner(request, response)){ //소유자가 아니라면 홈으로 튕기게

    response.redirect(`/`); 
    return false; //false를 사용하여 다음으로 넘어가지 않게 끊기
  }
  
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    
    //express redirect
    response.redirect('/');
  });

});


// page detail view
router.get('/:pageId', function(request, response){
  
  //var filteredId = path.parse(request.params.pageId).base;

  var queryDataID = path.parse(request.params.pageId).base;
  console.log('queryDataID 1확인1');
  console.log(queryDataID);
  //console.log('queryData 1확인1');
  //console.log(queryData);
  //console.log('queryData 2확인2');
  //console.log(queryData.id);

 

  //mysql> SELECT * FROM topic WHERE id = 1;
  db.query(`SELECT * FROM topic`, function(error,topics){
                  
    //console.log(topics);
    //topic i값 가져오기 실패시
    if(error){
      throw error; //에러가 있을시, 다음으로 넘어가지 않고 에러를 콘솔에 표현 + 중지
    }

    //topic & author JOIN 
    db.query(`SELECT * FROM topic JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryDataID[0]], function(error2, topic){
        
      //id=?`, [queryData.id] <- id=${queryData.id} 보다 안전하고,  id=?가 자동으로 [queryData.id]를 치환해줌                
      console.log('topic 테이블 확인');
      console.log(topic);
      if(error2){

        throw error2;
      }
      
      //var filteredId = path.parse(request.params.pageId).base;
      // topic.id = 4가 아님 
      var title = topic[0].title; //db topic id값의 title
      var description = topic[0].description;
      var list = template.List(topics); //topics 함수 불러오기
      var html = template.HTML(title, list,
          
        `<h2>${title}</h2>
        ${description}
        <p>by ${topic[0].name}</p>`,
        ` <a href="/topic/create">🌻CREATE🌻</a><br><br>
          <a href="/topic/update/${queryDataID[0]}">💡UPDATE💡</a><br><br>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${queryDataID[0]}">
            <input type="submit" value="🔥delete🔥">
          </form>`,
          auth.StatusUI(request, response) //login status 추가

      ); //templateHTML함수에 title, list
      response.send(html);

    
    });
  });
});

 
/*
    var subject = topics.filter((topic,index) => {
      if (topic.id == request.params.pageId){
        return true;
      }
    });
    // 만약에 id가 4번 글을 선택했음
    // subject.id = 4
    console.log(subject)

    //topic & author JOIN 
    db.query(`SELECT * FROM topic JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [subject[0].id], function(error2, topic){
        
      //id=?`, [queryData.id] <- id=${queryData.id} 보다 안전하고,  id=?가 자동으로 [queryData.id]를 치환해줌                
      console.log(topic)
      if(error2){

        throw error2;
      }
      
      //var filteredId = path.parse(request.params.pageId).base;
      // topic.id = 4가 아님 
      var title = topic[0].title; //db topic id값의 title
      var description = topic[0].description;
      var list = template.List(topics); //topics 함수 불러오기
      var html = template.HTML(title, list,
          
        `<h2>${title}</h2>
        ${description}
        <p>by ${topic[0].name}</p>`,
        ` <a href="/topic/create">🌻CREATE🌻</a><br><br>
          <a href="/topic/update/${subject[0].id}">💡UPDATE💡</a><br><br>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${subject[0].id}">
            <input type="submit" value="🔥delete🔥">
          </form>`,
          auth.StatusUI(request, response) //login status 추가

      ); //templateHTML함수에 title, list
      response.send(html);

    
    });
  });
});
*/
//response.send(request.params);  app.get('/page/:pageId' -> {"pageId":"HTML(data)"} 표현

module.exports = router;