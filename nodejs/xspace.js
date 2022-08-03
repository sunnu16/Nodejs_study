//모듈의 형식 - 파일로 나누어 외부로 독립 가능
/*
var X = {
    v : 'V',
    f : function(){
        console.log(this.v);
    }
}
*/

var part = require('./xpart.js');
console.log(part); 
/*  part 변수는 require('./xpart.js'); 모듈을 로딩한 결과를 담음 
    -> xpart.js에 있는 module.exports = X;의 X의 객체
*/

//X.f();
part.f();
