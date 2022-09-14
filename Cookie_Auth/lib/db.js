//DB mysql

var mysql = require('mysql');
var db = mysql.createConnection({

    host:'127.0.0.1',
    
    user:'root',
    password:'0000',
    database:'set1'
});
db.connect();

//외부접속
module.exports = db;

/*.gitignore을 통해 추적 제외*/