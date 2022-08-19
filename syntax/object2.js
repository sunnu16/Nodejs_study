// OOP (Object Oriented Programming) - 객체 지향 프로그래밍

/*  JavaScript에서 function은
    처리해야할 일에 대한 정보를 담고 있는 구문(statement)
    + 동시에 값이다.
*/

var f = function(){
    console.log(1+1);
    console.log(1+2);
}
var a = [f];
a[0]();  // 결과-> 2 3  | 즉, 배열의 원소로서 함수가 된다.

var x ={
    func : f
}
x.func(); // 결과-> 2 3

/*
console.log(f);
f();
*/

//var i = if(true){console.log(1)}

//var w = while(true){console.log(1)};