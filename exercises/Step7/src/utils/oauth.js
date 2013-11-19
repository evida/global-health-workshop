var ORIGINALPAGE;

window.oauth = {
    setClientID: function(id){
        this.clientID = id;
    },
    setScope: function(scope){
        this.scope = scope;
    },
    requestToken: function(self, target){
        if (!this.clientID || !this.scope){
            throw "Data missing";
        };
        ORIGINALPAGE = self;
        redirectURI  = 'https://' + window.location.hostname + window.location.pathname;
        var url = "https://evida.pt/appbase/auth2/" +
                "?scope="         + escape(this.scope)  +
                "&redirect_uri="  + escape(redirectURI) +
                "&response_type=" + escape('token')     +
                "&client_id="     + escape(this.clientID);
        $(target).attr('href', "javascript:poptastic('"+ url +"')");
    },
  requestUser: function(token, successFunction){
        $.ajax({
            url: "https://api.evida.pt/users",
            dataType: "jsonp",
            data:{
                bearer_token: token
            },
            success: successFunction
        });
    },
    checkForToken: function(loc){
        var queryString = decodeURIComponent( location.hash.substring(1) );
        var params      = queryString.split(/#|&|=/);
        var index       = $.inArray('access_token', params);
        if (index > -1){
            // Return the new data to the original page
            window.opener.commAuthComplete( params[index+1] );
            // Close this window
            window.close();
        }
    },
};

function poptastic(url) {
    var pop = window.open(url, 'name', 'height=330, width=400');
    if (window.focus) { 
        pop.focus() 
    }
}
function commAuthComplete(token) {
    ORIGINALPAGE.setToken( token );
}