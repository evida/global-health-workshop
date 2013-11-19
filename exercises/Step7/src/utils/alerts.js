window.alerts = {
    inlineError: function(target, msg){
        this.__inline(target, 'error', msg);
    },
    inlineSuccess: function(target){
        this.__inline(target, 'success', '');
    },
    __inline: function(target, klass, msg){
        var controlGroup = $('#' + target).parent().parent();
        $('.help-inline', controlGroup).html( "" );
        controlGroup.removeClass( 'error success' );
        controlGroup.addClass( klass );
        $('.help-inline', controlGroup).html( msg );
    },
    success: function(msg){
        this.__alert( msg, "alert-success" );
    },
    info: function(msg){
        this.__alert( msg, "alert-info" );
    },
    error: function(msg){
        this.__alert( msg, "alert-error" );
    },
    __alert: function(msg, klass){
         $('.alert').html("");
         $('.alert').removeClass("alert-error alert-info alert-success");
         $('.alert').addClass( klass );
         $('.alert').html('<button type="button" class="close" data-dismiss="alert">&times;</button>')
         $('.alert').append( msg )
         this.__animateAlert();
    },
    __animateAlert: function(){
        $('.alert').bind('click', function () {
            $('.alert').slideUp('fast', function() {
                $('.alert').hide();
                $('.alert').html("");
            });
        });
        $('.alert').slideDown('slow', function() {
            $('.alert').show();
        });
    },
};