//C.R.U.D 중 Read

var fs = require('fs');
fs.readFile('sample.txt', 'utf8', function(err, data){
    console.log(data);
});