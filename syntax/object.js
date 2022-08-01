//Object(객체) & Array(배열)

/*
배열은 객체와 함께 정보(element)를 정리 정돈하는 도구

*차이점*

 배열
 - 순서에 따라 정보(element)를 정리 정돈 가능
 - 정보들은 고유한 식별자(숫자)가 있다.

 객체
 - 순서 없이 정보를 저장 + 정리 정돈 가능
 - 객체는 숫자가 아닌 이름으로 식별자를 줄 수 있다.
 */

//array
var menmbers = ['node', 'A1111', 'haha'];
console.log(menmbers[1]); // 결과 : A1111

var i = 0;
while(i < menmbers.length){
    console.log('array-loop =>', menmbers[i]);
    i = i + 1;
}


//object
var roles = {

//   'key' : 'value'
    'ceo' : 'node',
    'programmer' : 'A1111',
    'cto' : 'haha'
}
console.log(roles.programmer);  // 결과 : A1111
console.log(roles[programmer]); // 결과 : A1111


/*객체의 loop 사용법
    for(*변수* in *반복처리할 객체*){
        console.log('object =>', name);
    }
    */

for(var name in roles){
    console.log('object => ', name, 'value => ', roles[name]);
}
/*
    결과
    object =>  ceo          value =>  node
    object =>  programmer   value =>  A1111
    object =>  cto          value =>  haha
*/  

