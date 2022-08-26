//author.js

//mysql db 연동
var db = require('./db.js');
//template 모듈 추가로 변환
var template = require('./template.js');
//url 모듈을 사용
var url = require('url'); 
//querystring 모듈 추가
var qs = require('querystring');


exports.home = function(request, response){
    
    db.query(`SELECT * FROM topic`, function(error,topics){

        db.query(`SELECT * FROM author`, function(error2,authors){
            
            var title = '🌈Author🌈';
            var list = template.List(topics); //topics 함수 불러오기
            var html = template.HTML(title, list,
                
                //author table 불러오기
                `                
                ${template.authorTalbe(authors)}
                
                <style>
                    body {
                        padding:1.5em;
                        background: #f5f5f5
                    }                
                    table {                    
                        border: 1px #a39485 solid;
                        font-size: .9em;
                        box-shadow: 0 2px 5px rgba(0,0,0,.25);
                        width: 70%;
                        border-collapse: collapse;
                        border-radius: 5px;
                        overflow: hidden;
                    }                
                    th {
                        text-align: left;
                    }                    
                    thead {
                        font-weight: bold;
                        color: #fff;
                        background: #73685d;
                    }                    
                    td, th {
                        padding: 1em .5em;
                        vertical-align: middle;
                    }                    
                    td {
                        border-bottom: 1px solid rgba(0,0,0,.1);
                        background: #fff;
                    }                
                    a {
                        color: #73685d;
                    }

                    @media all and (max-width: 768px) {                    
                        table, thead, tbody, th, td, tr {
                        display: block;
                        }                    
                        th {
                        text-align: right;
                        }                    
                        table {
                        position: relative; 
                        padding-bottom: 0;
                        border: none;
                        box-shadow: 0 0 10px rgba(0,0,0,.2);
                        }                    
                        thead {
                        float: left;
                        white-space: nowrap;
                        }                    
                        tbody {
                        overflow-x: auto;
                        overflow-y: hidden;
                        position: relative;
                        white-space: nowrap;
                        }                    
                        tr {
                        display: inline-block;
                        vertical-align: top;
                        }                    
                        th {
                        border-bottom: 1px solid #a39485;
                        }                    
                        td {
                        border-bottom: 1px solid #e5e5e5;
                        }

                </style>   
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit" value="🌻CREATE🌻">
                    </p>
                </form>            
                `,            
                ``                

            );
            response.writeHead(200);
            response.end(html);

        });                

    });

}

//create_author_process
exports.create_process = function(request, response){

    var body = '';

    //request.on을 사용하여 data 수신할때마다 function(data){}를 호출
    request.on('data', function(data){  

        body = body + data;
        /*body에다 callback이 실행될 때마다 data를 추가
        (+전송된 data의 크기가 너무 클때, 
        접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지)*/

    });

    //data 수신이 끝났을때
    request.on('end', function(){
            
        var post = qs.parse(body);

        //INSERT INTO topic(title, description, created, author_id) VALUES('example', 'create ex...', NOW(), 1);
        db.query(`

            INSERT INTO author (name, profile) 
                VALUES(?, ?)`,
            [post.name, post.profile], 
            function(error, result){
                
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/author`});
                response.end();

            }
        )

    });
}

//update
exports.update = function(request, response){
    
    db.query(`SELECT * FROM topic`, function(error,topics){

        db.query(`SELECT * FROM author`, function(error2,authors){
            
            var _url = request.url;
            var queryData = url.parse(_url, true).query;

            db.query(`SELECT * FROM author WHERE id =?`, [queryData.id], function(error3,author){
                
                var title = '🌈Author🌈';
                var list = template.List(topics); //topics 함수 불러오기
                var html = template.HTML(title, list,
                    
                    //author table 불러오기
                    `                
                    ${template.authorTalbe(authors)}
                    
                    <style>
                        body {
                            padding:1.5em;
                            background: #f5f5f5
                        }                
                        table {                    
                            border: 1px #a39485 solid;
                            font-size: .9em;
                            box-shadow: 0 2px 5px rgba(0,0,0,.25);
                            width: 70%;
                            border-collapse: collapse;
                            border-radius: 5px;
                            overflow: hidden;
                        }                
                        th {
                            text-align: left;
                        }                    
                        thead {
                            font-weight: bold;
                            color: #fff;
                            background: #73685d;
                        }                    
                        td, th {
                            padding: 1em .5em;
                            vertical-align: middle;
                        }                    
                        td {
                            border-bottom: 1px solid rgba(0,0,0,.1);
                            background: #fff;
                        }                
                        a {
                            color: #73685d;
                        }
                    </style>

                    <form action="/author/update_process" method="post">
                        <p>
                            <input type="hidden" name="id" value="${queryData.id}"
                        </p>
                        <p>
                            <input type="text" name="name" value="${author[0].name}" placeholder="name">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="💡UPDATE💡">
                        </p>
                    </form>            
                    `,
                    ``            

                );
                response.writeHead(200);
                response.end(html);

            });
            
        });                

    });

}

/*update_process*/
exports.update_process = function(request, response){

    var body = '';

    //request.on을 사용하여 data 수신할때마다 function(data){}를 호출
    request.on('data', function(data){  

        body = body + data;
        /*body에다 callback이 실행될 때마다 data를 추가
        (+전송된 data의 크기가 너무 클때, 
        접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지)*/

    });

    //data 수신이 끝났을때
    request.on('end', function(){
            
        var post = qs.parse(body);

        db.query(`
            UPDATE author SET name=?, profile=? WHERE id=?`,
            [post.name, post.profile, post.id],
            
            function(error, result){
                                
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/author`});
                response.end();

            }
        )

    });
}

/* delte_process */
exports.delete_process = function(request, response){

    var body = '';

    //request.on을 사용하여 data 수신할때마다 function(data){}를 호출
    request.on('data', function(data){  

        body = body + data;
        /*body에다 callback이 실행될 때마다 data를 추가
        (+전송된 data의 크기가 너무 클때, 
        접속을 끊을 보안 장치도 추가 가능한 방법도 존재함을 인지)*/

    });

    //data 수신이 끝났을때
    request.on('end', function(){
            
        var post = qs.parse(body);

        db.query('DELETE FROM author WHERE id=?', [post.id],            
            function(error, result){
                                                
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: `/author`});
                response.end();

            }
        );

    });
}