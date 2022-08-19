//fs.readdir - file list in directory

var testFoler = '../data/';
var fs = require('fs');

fs.readdir(testFoler, function(error, filelist){
    console.log(filelist); 
    //data 디렉토리의 위치 확인 후 실행(실행을 어디서 하느냐에 따라 data의 경로 설정)
})

