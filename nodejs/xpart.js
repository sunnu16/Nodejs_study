//xspace.js

var X = {
    v : 'V',
    f : function(){
        console.log(this.v);
    }
}

module.exports = X; 
/* 모듈이 담겨있는 xpart.js 파일의 기능 중 
   X가 가리키는 객체를
   모듈 밖에서 사용할수 있도록 exports 하겠다. */