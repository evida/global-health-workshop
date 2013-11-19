window.utils = {
    capitalize: function(string){
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    getJSONP: function(url, data, successFunction){
        $.ajax({ 
            url: url, 
            dataType: "jsonp",
            data: data,
            success: successFunction,
        });
    },
};