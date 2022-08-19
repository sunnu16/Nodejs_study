//배열

var arr = ['A','B','C','D']; //[]배열은 0번째부터 시작함

console.log(arr[0]); //결과값 : A
console.log(arr[3]); //결과값 : D

//arr 배열 안의 'C'를 3으로 변환
arr[2] = 3;
console.log(arr);

//arr 배열의 개수 카운트
console.log(arr.length);

//ex. arr 배열의 맨 마지막에 데이터 추가
arr.push('E');
console.log(arr);