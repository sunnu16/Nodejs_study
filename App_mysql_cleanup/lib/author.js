//author.js

//mysql db 연동
var db = require('./db.js');
//template 모듈 추가로 변환
var template = require('./template.js');


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
                `,            
                `<a href="/create">🌻CREATE🌻</a>`
                //templateHTML함수에 title, list

            );
            response.writeHead(200);
            response.end(html);

        });
                

    });

}