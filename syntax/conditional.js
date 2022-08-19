//제어문 - 조건문 = if문

// A B C1 D 순으로 출력 하고 싶을 때
console.log('A');
console.log('B');
if(true){
    console.log('C1');
} else{
    console.log('C2');
}
console.log('D');

// A B C2 D 순으로 출력 하고 싶을 때
console.log('A');
console.log('B');
if(false){
    console.log('C1');
} else{
    console.log('C2');
}
console.log('D');  


//nodejs 콘솔에서의 입력값

var args = process.argv;  //  어떻게 아규먼트를 커맨드라인에서 nodejs에 넣을 것인가
console.log(args[2]);  
                    //node input_parameters.js 1 <- 실행
                    //결과값의 0번째 -> nodejs 런타임이 어디에 위치하고 있는지 알려줌
                    //         1번째 -> 실행시킨 파일의 위치
                    //         2번쨰 -> 입력한 값 -> 1 을 표시
                    // 즉, nodejs는 2번째 정보부터 입력값부터 주도록 약속되어있다.

console.log('A');
console.log('B');
if(args[2] === '1'){
    console.log('C1');
} else{
    console.log('C2');
}
console.log('D');

//node conditinal.js 1 <- 실행시
//args[2]의 값이 1로 입력되었으므로 args[2] === '1'이 참이 되어 A B C1 D가 출력된다.