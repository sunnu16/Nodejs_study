//object 심화

var v1 = 'v1';
// 10000 code 있다고 가정
v1 = 'qwer'; //엉뚱한 상황이 발생 가능하다
var v2 = 'v2';

//폴더에 파일들을 정리 정돈 하는 느낌쓰
var o = {
    v1 : 'v1',
    v2 : 'v2',
    f1 : function(){
        console.log(this.v1); // this를 사용함으로서, 함수가 속해 있는 객체를 참조 가능
    },
    f2 : function(){
        console.log(this.v2);
    }
}
o.f1();
o.f2();
// o라는 객체 안에 서로 연관되어 있는 값들과 그 값들을 처리하는 함수들이 그룹핑되어 있다. 

/*
function f1(){
    console.log(o.v1);
}
function f2(){
    console.log(o.v2);
}
*/