//DB mysql

var mysql = require('mysql');
var db = mysql.createConnection({
    
    host : '', //DB 서버가 어디에 있는가
    user : '',
    password : '',
    database : '' //연결할 database name
});
db.connect();

//외부접속
module.exports = db;
