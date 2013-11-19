# Sessão Técnica Plataforma eVida - 20 Nov

## Introdução

Este workshop assume que o utilizador está familiarizado com o conceito e objectivos da plataforma eVida bem como dos dois tipos de aplicações que esta suporta: hosted e packaged. 

Durante o workshop o utilizador irá criar uma conta na plataforma eVida e de seguida desenvolver uma aplicação packaged para a mesma. O desenvolvimento da aplicação será feito passo a passo, e após a conclusão de cada passo a aplicação será submetida na plataforma para constatar a evolução da mesma.

No final deste documento estão compilados um conjunto de recursos que são referidos ao longo de workshop e necessários para a resolução do mesmo, bem como uma série de recursos adicionais.

Quaisquer dúvidas que surjam durante o workshop devem ser esclarecidas com qualquer com dos elementos da equipa. Para dúvidas futuras basta utilizar os contactos fornecidos no final do documento. Boa sorte!

## Exercícios

### 1. Criar uma conta na plataforma eVida

O primeiro passo deste workshop consiste em criar uma conta de utilizador na plataforma eVida, através do link <https://www.evida.pt>. Após concluído o registo, devem fazer login na plataforma e aceder à web store.

Por defeito, quando um utilizador acede pela primeira vez à plataforma a sua conta não está associada a uma conta de developer. Como neste workshop pretendemos desenvolver uma aplicação, precisamos que a conta do utilizador seja de developer. Para isso, basta aceder ao menu ***"Settings"*** da barra lateral, de seguida ***"Developer Settings"*** e por fim alterar o campo ***"Connect this account to a developer account"*** para ""***Yes***.

### 2. Obter o esqueleto da aplicação packaged

Neste passo irá fazer o download do código esqueleto da aplicação que iremos desenvolver. Este código pode ser obtido em:

```
LINK do código do git
```

ou

```
LINK para um ZIP
```

### 3. Configuração da aplicação

De seguida é preciso alterar o ficheiro `config.xml`. Este é um ficheiro de manifesto que possui as informações necessárias à inicialização da aplicação. Permite especificar o nome da aplicação, as suas dimensões, bem como informações adicionais como o autor, descrição, acesso a recursos externos, acesso a funcionalidades da plataforma, entre outros:

```
<?xml version="1.0" encoding="utf-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" id="http://widgets.tice.ipn.pt/<unique_id>" version="1.0.0">
	<name>Global Health Demo App</name>
	<description xml:lang="en">Check out your progress.</description>
	<description xml:lang="pt">Acompanhe a sua evolução.</description>
	<content src="index.html" />
	<author>Diogo Lucas, Miguel Oliveira, Nuno Rebelo</author>
	<icon src="styles/images/getfit.jpg" />
</widget>
```

Em primeiro lugar iremos definir o ID da aplicação. Esta tem sempre o formato:

```
http://widgets.tice.ipn.pt/<unique_id>
```

em que `<unique_id>` deve ser substituído por um identificador único da vossa aplicação. Assim, devem substituir este sufixo por, por exemplo, o vosso username da plataforma, garantindo assim que o ID da aplicação será único.

Podem também alterar os campos `name` e `description` à vossa vontade.

### 4. Autenticação da aplicação na plataforma

Neste passo iremos autenticar a aplicação na plataforma com recurso ao protocolo OAuth2. OAuth2 is a specification that focuses on client developer simplicity while providing specific authorization flows for web applications, desktop applications, mobile phones, and living room devices.

Para utilizar o protocolo OAuth2 é necessário que o utilizador possua uma Consumer Key. Esta deve ser gerada no menu ***"Developer"*** da barra lateral, tab ***"API Access"***. Nesta página deve clicar em ***"Create another OAuth Consumer"*** e preenchar o campo `Consumer Name` com o ID da vossa aplicação (correspondente ao `<unique_id>`) definido no step 3. O campo `Redirection URI` para o efeito deste workshop pode ficar em branco.

Usando a API disponibilizada, em `/src/views/home_view.js` podemos requisitar o token de autenticação OAuth2 desejado. Primeiro é definido o scope do token (define que tipo de dados queremos aceder) assim como o client id.

```
requestOAuth: function(){
	oauth.setScope('user');
	//Consumer Key
	oauth.setClientID('<consumer_key');
	oauth.requestToken(this, '#oauth_btn');
	$('#my_modal').hide();
}
```

O campo `<consumer_key>` deverá ser substituído pela Consumer Key criada na plataforma eVida.

Após este passo iremos submeter na plataforma eVida a primeira versão da aplicação. Para isso, crie um arquivo comprimido ZIP que contenha o conteúdo existente no interior da pasta da aplicação (não inclua a pasta em si, mas apenas o seu conteúdo). Altere a extensão de `.zip` para `.wgt`. A este ficheiro comprimido é dado o nome de widget na especificação Widgets 1.0 do W3C.

De seguida, aceda à plataforma eVida e ao menu ***"Developer"*** da sidebar. Carregue no link ***"Create an App"***, e de seguida escolha a opção ***"New Packaged App"*** e faça o upload do ficheiro .wgt criado no passo anterior. A sua aplicação está agora disponível no menu ***"Developer"*** da sidebar, no separador ***"Developed by you"***. Ao executar a aplicação verifique como esta pede ao utilizador permissões através do protocolo OAuth2.

Uma vez obtido o token podemos fazer um request HTTP (ajax GET) à API do portal para obter a informação do utilizador, tal como faremos no passo seguinte.

### 5. Obtenção do utilizador logado

No passo anterior autenticámos a nossa aplicação na plataforma. É possível obter outro tipo de informações, como por exemplo qual o utilizador que está logado na plataforma.

No ficheiro `/src/views/home_view.js` já existe a função:

```
requestUser: function(){
	var self = this;
 	oauth.requestUser(this.token, function(response){
 		self.user = response.user;
 	});
}
```

Esta função usa a API disponibilizada em `/src/utils/oauth.js`. O pedido requer autenticação por token oauth um vez que se trata de dados sensíveis ao utilizador. Obtida essa informação podemos manipular a nossa view de acordo com o username do utilizador.

```
requestUser: function(token, successFunction){
	$.ajax({
		url: "<users_api_url>",
		dataType: "jsonp",
		data:{
			bearer_token: token
		},
		success: successFunction
	});
}
```

O URL da API de utilizadores da plataforma eVida é `https://api.evida.pt/users.` Deverá substituir no ficheiro `/src/utils/oauth.js` o campo `<users_api_url>` por este URL.

Volte agora ao ficheiro `/src/views/home_view.js`. O objecto `response` contém o `user` que está logado na aplicação. É possível aceder ao `username` do utilizador através `user.username`.

```
self.user = response.user;

```

Crie um `alert` que mostre no ecrã o `username` do utilizador após ser feita a autenticação.

Volte a comprimir e re-submeta a aplicação. Deverá agora ser apresentado um alert com o username do utilizador logado quando a aplicação é executada.

### 6. Estilos

Foi desenvolvido um tema do conhecido Twitter Bootstrap para que as aplicações possam, de forma fácil, ter uma imagem semelhante ao portal em que se inserem. O URL deste CSS é `https://evida.pt/css/apps/assets/bootstrap-v0.6.1.css`.

No ficheiro `index.html` há que completar o código, com o URL do css disponibilizado no portal na secção Guias de estilo para front-end:

```
<head>
	<meta charset="utf-8">
	<title>Get Fit</title>
	<link rel="stylesheet" href="<css_url>">
	<link rel="stylesheet" href="styles/my.css">
	
	<script data-main="main.js" src="libs/require-jquery.js"></script>
	<script src="https://evida.pt/js/apps/app-container.js?evida-backbone-demo-app"></script>
</head>
```

Deverá substituir o campo `css_url` pelo URL do CSS disponibilizado. Re-submeta a aplicação e verifique as mudanças no aspecto da mesma.

### 7. Utilização da API Javascript do portal para herdar o *locale* do utilizador

Para cumprir o objectivo deste exercício é necessário utilizar as APIs Javascript da plataforma no sentido de obter a língua escolhida pelo utilizador no portal. Para definir a língua que está a ser usada aceda ao menu ***"Settings"*** da barra lateral, e no separador ***"General information"*** pode definir a língua que deve ser usada através do campo ***"Language"***.

Aceda agora ao ficheiro `/src/utils/i18n.js`. Este ficheiro contém a função `setLocale` que é responsável por obter a língua escolhida pelo utilizador no portal, e adequar as mensagens da aplicação à respectiva língua:

```
setLocale: function(){
	var self = this;
	//TODO: call the Javascript API method to get locale
	$c().services("<api_method>", {}, function(args) {
		//TODO: set self.locale accordingly
		
		if (self.locale=='pt'){
			self.successOAuth   = "<b>Sucesso!</b> Autenticação finalizada.</b>";
			$('h1').text("Gráfico de medições");
			$('p').text("Distância e calorias ao longo do tempo.");
		} else {
			self.setDefault();
		};
	});
}
```

Deverá implementar os dois `//TODO` assinalados no código de forma a completar a função `setLocale`. Para o ajudar a resolver o exercício deverá consultar a documentação da API Javascript que é disponibilizada pelo portal: <https://developer.evida.pt/js-api/template.html#widget-properties-api/en>.

Compile e re-submeta a aplicação. Altere a língua do portal eVida e repare como as mensagens se adaptam à língua utilizada.

### 8. Integração com a aplicação do PHR

O último passo deste workshop consiste em integrar a nossa aplicação com uma outra aplicação do portal eVida, chamada `GenericEntity`. Esta última aplicação disponibiliza um `PHR` (Personal Health Record) que permite guardar diversos dados clínicos do utilizador. No âmbito deste exercício iremos inserir na nossa aplicação um gráfico com as medições do nosso exercício físico de bicicleta.

Uma vez que ainda não temos medições registadas, precisamos de aceder a aplicação GenericEntity a partir do portal eVida para inserir medições. A partir da web store do portal, seleccione a aplicação ***"Generic Entity"***, e aceda ao menu ***"Measurements"*** e de seguida ao submenu ***"Bicycle Exercise"***. Insira por exemplo três registos na interface que é disponibilizada.

Iremos agora disponibilizar estas medições na nossa aplicação sob a forma de um gráfico. No ficheiro `/src/utils/chart.js` existe a função `loadGraph` que recebe um URL e desenha o gráfico pretendido. Esta função é chamada a partir do ficheiro  `/src/views/home_view.js`:

```
initialize: function(){
	i18n.setDefault();
	this.setToken( cookies.get() );
	loadGraph("http://core.ge.evida.pt/BicycleExercise/items?apiRequest.username=<username_here>&apiRequest.sidx=measurement_date");
}
            
```
No URL que é passado à função `loadGraph` deve substituir o campo `username_here` pelo seu próprio `username`. Re-submeta a aplicação e deverá conseguir visualizar o gráfico com as medições que submeteu.

## Recursos

Recursos necessários para o workshop:

* Plataforma eVida: <https://www.evida.pt>
* Users API URL: <https://api.evida.pt/users>
* CSS URL: <https://evida.pt/css/apps/assets/bootstrap-v0.6.1.css>
* API Javascript do portal: <https://developer.evida.pt/js-api/template.html#widget-properties-api/en>

Outro tipo de recursos:

* Protocolo OAuth2: <<http://oauth.net/2/>
* Twitter Bootstrap: <http://getbootstrap.com/>

## Contactos

A equipa técnica do eVida é constituída por:

* [Diogo Lucas](mailto:dlucas@ipn.pt)
* [Miguel Oliveira](mailto:moliveira@ipn.pt)
* [Nuno Rebelo](mailto:nrebelo@ipn.pt)