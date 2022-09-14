//Cookie - 서버가 사용자의 웹 브라우저에 전송하는 작은 데이터 조각


/*
    *쿠키의 목적*
    - 세션 관리(Session management)
      서버에 저장해야 할 로그인, 장바구니, 게임 스코어 등의 정보 관리
    
    - 개인화(Personalization)
      사용자 선호, 테마 등의 세팅
    
    - 트래킹(Tracking)
      사용자 행동을 기록하고 분석하는 용도
*/


var http = require('http');
//npm cookie handling 모듈 추가
var cookie = require('cookie');

http.createServer(function(request, response){

    console.log(reqeust.headers.cookie);
    
    var cookies = {};
    //쿠키의 값을 지웠을 때 에러가 나지 않게 (parse가 undefined를 수용x)
    if(reqeust.headers.cookie !== undefined){
        cookies = cookie.parse(reqeust.headers.cookie);
    }

    console.log(cookies);
    
    //쿠키 생성
    response.writeHead(200, {
        'Set-Cookie' : ['yummy_cookie=choco', 'tasty_cookie=strawberry']        
    });
    response.end('Cookie');
}).listen(5000);