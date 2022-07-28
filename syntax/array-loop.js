//배열과 반복문의 예제

//number 배열의 데이터를 하나씩 출력하기
var number =[1,600,16,34,66];
var i = 0;

while(i < 5){
    console.log(number[i]);
    i = i + 1;
}

//number 배열의 데이터 출력이 유동적으로 변환 가능하게
var number =[1,600,16,34,66,6666];
var i = 0;

while(i < number.length){
    console.log(number[i]);
    i = i + 1;
}

//number 배열의 데이터 값을 더하기
var number =[1,600,16,34,66];
var i = 0;
var total = 0;

while(i < number.length){
    total = total + number[i];
    i = i + 1;
}
console.log(`total : ${total}`);
