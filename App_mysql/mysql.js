//mysql 모듈 사용 
var mysql = require('mysql');
var connection = mysql.createConnection({

    host : '**********', //DB 서버가 어디에 있는가
    user : '**********', 
    password : '***********',
    database : '**********', //연결할 database name
    port : '**********'

});

connection.connect(); // mysql 접속 

//query를 통해 DB의 topic 테이블 (객체의 형태) 반환
connection.query('SELECT * FROM topic', function(error, results, fields){
    if(error) {
        console.log(error);
    }
    console.log(results);

});

connection.end();