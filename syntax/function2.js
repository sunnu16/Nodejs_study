//함수의 입력

//javascript에 기본적으로 내장되어 있는 함수
//Math 내장하고 있는 객체, round(반올림)라는 함수
console.log(Math.round(1.6)); //2
console.log(Math.round(1.4)); //1

//function sum(매개변수){}  매개변수 -parameter
function sum(first, second){
    console.log(first+second)
} 
//sum(2,4);의 sum함수의 first 변수 -> 2, second -> 4로 세팅함
sum(2,4);
//sum 안에 들어있는 각각의 입력값을 argument(인자)라 함 

//함수의 출력

function sum(first, second){
    console.log('A');
    return first+second;
    console.log('B'); 
    /*실행 결과 : A 6
    즉, return을 만나면 출력과 동시에, 함수가 실행이 종료된다.*/

} 
console.log(sum(2,4));

