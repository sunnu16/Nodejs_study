//template 모듈

//모듈 활성화

module.exports = {
    
    //home
    HTML: function (title, list, body, control) {
        return `
        <!doctype html>
        <html>
        <head>
            <title>🦄Node.js & WEB🚀 💨 ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">🚀Node.js & WEB🚀</a></h1>
            <a href="/author">🌈Author manage🌈</a> 
    
            ${list}
            ${control}
            ${body}
    
        </body>
        </html>
        `;
    },
    
    //List
    List : function (topics){ //filelist -> topics
        var list = '<ul>';
        //파일 목록 만들기
        //topics 배열을 이용한 반복 적용
        var i = 0;
        while(i < topics.length){
            //list의 값에다가 topics 추가
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`; //mysql topic table의 id와 title 불러오기
            i = i + 1;
        }
        list = list + `</ul>`;
        
        return list;
    },

    //authorSelect
    authorSelect : function(authors, author_id){
        
        var tag = '';
        var i = 0;
        while(i < authors.length){

            var selected ='';
            //현재 author id값과 while문 안의 현재 순번의 author id값이 같다면 
            if(authors[i].id === author_id){
                selected = 'selected';

            }

            tag = tag + `<option value = "${authors[i].id}"${selected}>${authors[i].name}</option>`;
            i++;
    }
    return `
    <select name = "author">
        ${tag}
    </select>
    `

    },

    //authorTalbe
    authorTalbe : function(authors){

        var tag = '<table>';
        //authors 변수의 원소만큼 반복문 실행
        var i = 0;
        while(i < authors.length){

            tag += `
                <tr>
                    <td>${authors[i].name}</td>
                    <td>${authors[i].profile}</td>
                    <td><a href="/author/update?id=${authors[i].id}">💡UPDATE💡</td>
                    <td>🔥DELETE🔥</td>
                </tr>
                ` 
            i++;
        }
        tag += '</table>'
        return tag;

    }
}

