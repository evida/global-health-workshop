define(
    [
        'text!templates/navbar.html',
        'text!templates/home.html',
        'text!templates/modal.html'
    ], 
    function(NavbarTemplate, HomeTemplate, ModalTemplate)
    {          
        var EvidaView = Backbone.View.extend({
            el: $("body"),
            events: {
                "click #oauth_btn":  "requestOAuth"
            },
            initialize: function(){
                i18n.setDefault();
                this.setToken( cookies.get() );
				//TODO: get the Generic Entity url
				loadGraph("http://core.ge.evida.pt/BicycleExercise/items?apiRequest.username=insert_username_here&apiRequest.sidx=measurement_date");            },
            render: function(){
                if (!window.opener) i18n.setLocale();
                this.renderNavbar( NavbarTemplate );
                this.renderHome( HomeTemplate );
                this.showAlert();
                if (!this.token) {
                    oauth.checkForToken();
                    this.showModal( ModalTemplate );
                }
            },
            /*
            Render related methods
            */
            renderNavbar: function(template){
                var username = this.user ? this.user.username : null;
                var compiledTemplate = _.template( template, {
                });
                $(this.el).html( compiledTemplate );
            },
            renderHome: function(template){
                var compiledTemplate = _.template( HomeTemplate, {
                    main_title: i18n.main_title,
                    label_one: i18n.label_one,
                    _: _
                });
                $(this.el).append( compiledTemplate );
            },
            showAlert: function(){
                if (this.alert){
                    alerts.success( this.alert );
                    this.alert = "";
                };
            },
            showModal: function(template){
                $(this.el).append( template );
                $('#my_modal').modal({
                    keyboard: false,
                    backdrop: 'static',
                    show:     true,
                });
            },
            /*
            Events callback
            */
            requestOAuth: function(){
                oauth.setScope('user');
				//Consumer Key
                oauth.setClientID('8ae08bd30db31932857e09760895b7');
                oauth.requestToken(this, '#oauth_btn');
                $('#my_modal').hide();
            },
            /*
            Auxiliar methods
            */
            setToken: function(token){
                if (!token) return;
                alerts.success( i18n.successOAuth );
                cookies.set( token );
                $('#my_modal').modal('hide');
                this.token = token;
                this.requestUser();
            },
            requestUser: function(){
                var self = this;
                oauth.requestUser(this.token, function(response){
                    self.user = response.user;
                    alert(self.user.username);
                });
            }
        });

        return new EvidaView;
    }
);
