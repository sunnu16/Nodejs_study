//template 모듈

//모듈 활성화

module.exports = {
                
    HTML: function (title, list, body, control) {
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB * EX - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1> 
    
            ${list}
            ${control}
            ${body}
    
        </body>
        </html>
        `;
    },
        
    List : function (filelist){
        var list = '<ul>';
        //파일 목록 만들기
        //filelist 배열을 이용한 반복 적용
        var i = 0;
        while(i < filelist.length){
            //list의 값에다가 filelist 추가
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list + `</ul>`;
        
        return list;
    }
}

