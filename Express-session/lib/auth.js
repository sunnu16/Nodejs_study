// lib/auth.js

//template.js와 같은 형식

module.exports = {

    // login check
    IsOwner : function(request, response){
        
        if(request.session.is_logined){
            
            return true;
        } else{
             
            return false;
        }
    },

    // login status
    StatusUI : function(request, response){

        var authStatusUI = '<a href="/auth/login">🔑LOGIN🔑</a>';
        if(this.IsOwner(request, response)){
    
            authStatusUI = `🍀${request.session.nickname}🍀 <a href="/logout">🔒Logout🔒</a>`;
        }
        return authStatusUI;
    }

}


