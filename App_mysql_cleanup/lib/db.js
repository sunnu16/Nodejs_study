//DB

var mysql = require('mysql');
var db = mysql.createConnection({

  host : '15.164.228.55',
  user : 'root',
  password : '0000',
  database : 'app_set1'
});
db.connect(); 

//외부접속
module.exports = db;

/*.gitignore을 통해 추적 제외*/