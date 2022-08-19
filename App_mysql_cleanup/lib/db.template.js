//DB mysql

var mysql = require('mysql');
var db = mysql.createConnection({

    host:'',
    user:'',
    password:'',
    database:''
});
db.connect();

//외부접속
module.exports = db;
