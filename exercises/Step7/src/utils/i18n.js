window.i18n = {
    setDefault: function(){

        this.main_title = "Measurement chart";
        this.label_one = "Distance and calories spent";
        this.successOAuth   = "<b>Success!</b> Authentication complete.</b>";



    },
    setLocale: function(){
        var self = this;
        $c().services("container.getLocale", {}, function(args) {
            self.locale = args[0];
            if (self.locale=='pt'){
                self.successOAuth   = "<b>Sucesso!</b> Autenticação finalizada.</b>";
				$('h1').text("Gráfico de medições");
				$('p').text("Distância e calorias ao longo do tempo.");

            }else {
                self.setDefault();
            };
        });
    },

};
