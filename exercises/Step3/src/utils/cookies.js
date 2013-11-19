var COOKIE_NAME = 'GetFitCookie';

window.cookies = {
    set: function(value) {
        $.cookie(COOKIE_NAME, value, { 
            path: '/', 
            expires: 1, 
        });    
    },  
    get: function() {
        return $.cookie(COOKIE_NAME);
    }  
};