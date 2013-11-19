define(
    [
        'src/views/home_view',
    ], 
    function(evidaView)
    {
        var AppRouter = Backbone.Router.extend({
            routes: {
                "*actions": "home",
            },
            /*
            Callback functions
            */
            home: function(){
                evidaView.render();
            }
        });
        
        var initialize = function(){
            var app_router = new AppRouter;
            Backbone.history.start();
        };
        return { 
            initialize: initialize
        };
    }
);
