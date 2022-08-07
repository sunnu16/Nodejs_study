//mysql 모듈 사용 
var mysql = require('mysql');
var connection = mysql.createConnection({

    host : '15.164.226.103', //DB 서버가 어디에 있는가
    user : 'root',
    password : '0000',
    database : 'app_set1' //연결할 

});
//AWS RDS가 아닌 EC2 인스턴스 상에 mysql 설치후 DB저장하여 사용

connection.connect(); // mysql 접속 

//query를 통해 DB의 topic 테이블 (객체의 형태) 가져오기
connection.query('SELECT * FROM topic', function(error, results, fields){
    if(error) {
        console.log(error);
    }
    console.log(results);

});

connection.end();