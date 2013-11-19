require.config({
    paths: {
        underscore: 'libs/underscore-min', 
        backbone:   'libs/backbone-min', 
        modal:      'libs/bootstrap-modal',
        text:       'libs/text',
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore':{
            exports: '_'
        },
        'modal':{
            exports: 'Modal'
        }
    }
});

require(
    [
        "underscore",
        "backbone",
        "modal",
        "src/router",
    ],
    function(_, Backbone, Modal, Router)
    {
        Router.initialize();     
    }
);
