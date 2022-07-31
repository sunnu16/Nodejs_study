//CallBack

//a라는 함수
function a(){
    console.log('A');
}
a();

//이름이 없는 함수(익명함수)를 var a = 로 a라는 값으로 함수를 정의(함수가 값으로 정의 가능)
var a = function(){
    console.log('A');
}
a();

//callback의 형식 example
var a = function(){
    console.log('A');
}

function slowfunc(callback){
    callback();
}
slowfunc(a);
/* slowfunc라는 함수가 실행되고, callback 파마미터가 a가 가리키는 함수를 값으로 가진다.
 그러면 callback(); 함수가 호출하면 a 함수의 console.log('A');가 실행된다.
*/