//(synchronous)동기 & (aynchronous)비동기

var fs = require('fs');

//readFileSync - 동기적 처리(뒤에 Sync가 붙음)
console.log('A');

//fs.readFileSync(path[, options])
var result = fs.readFileSync('sample.txt', 'utf8');
console.log(result);
console.log('C');
// 결과 : A B C  | 동기는 순차적(직렬적)으로 실행이 된다.


//readFile - 비동기적 처리(뒤에 Sync가 붙지 않음)
console.log('A');

//fs.readFile(path[, options], callback)
var result = fs.readFile('sample.txt', 'utf8', function(err, result){
    console.log(result);
    /*nodejs야 너가 가지고 있는 readFile 기능을 이용해서 
    'sample.txt' 파일을 읽어와
    근데 시간이 조금 걸리니 이 작업이 끝난 다음에 
    function(err, result){console.log(result);} - (함수 호출)을 실행 시켜*/

});

console.log('C');
// 결과 : A C B
/* 즉, 비동기는 병렬 작업을 한다
   A가 실행되고, B가 처리되는 동안(처리 시간이 더 길게 걸리기때문) C가 실행됨으로서 
   A C 결과를 먼저 보여주고 나중에 결과가 나온 B가 맨 마지막에 보여지게 된다. */
