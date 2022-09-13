// Home

//express를 다시 로딩
var express = require('express');
//express.Router() 호출시, router 객체를 리턴
var router = express.Router();

var template = require('../lib/template.js');
var qs = require('querystring');

// app.get('/', (req, res) => res.send('Hello Express!'))
router.get('/', function(request, response){
     
    var title = 'Welcome';
    var description = 'Hello, Node.js & Express - HOME';
    var list = template.List(request.list); //topics 함수 불러오기
    var html = template.HTML(title, list,
  
      `
      <h2>${title}</h2>${description}
      <img src = "/images/hello.jpg" style = "width:500px; display : block; margin-top: 10px;">
      `,
      `<a href="/topic/create">🌻CREATE🌻</a>`
      //templateHTML함수에 title, list
  
    );
    
    response.send(html); // writeHead(200)+ end(html)
    
  });

  module.exports = router;