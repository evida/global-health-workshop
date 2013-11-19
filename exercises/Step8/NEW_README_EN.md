# Workshop - eVida platform - 20th November

## Introduction

In this workshop we admit that the user is familiar with the concept and the goals of the eVida plataform, as well as the two application types that it supports: hosted e packaged. 

During this workshop, the user will create an account in the eVida platform followed by the development of a packaged application. This development will be done step by step and after the conclusion of a step, the user will submit the application on the plataform.

In the bottom of this document is summarized a set of an important resources to finish the resolution of the exercises.

If you have any questions in this workshop, ask to an element of the team. To future questions, you can contact one of the contacts in the bottom of this document. Good sdluck :)

## Exercises

### 1. Create a new account on the evida platform

The first step of this workshop aims to create a user account on the eVida platform, through this link <https://www.evida.pt>. When you finish the registration, you must login in the plataform and access to web store.

By default, when an user acess for the first time to the plataform, his account is not associated to a developer account. In this workshop we intend to develp an application, so we need this account to be connected to a developer account. So, you can do it by the menu ***"Settings"*** in the side bar, followed by ***"Developer Settings"*** and toggle the option ***"Connect this account to a developer account"*** to ""***Yes***.

### 2. Obtain the skeleton of the packaged application

In this step you will download the skeleton code of the application to be developed. You can find this code in:

```
LINK to git code
```

or

```
LINK to a ZIP file
```

### 3. Configuration of the aplication

Following, is necessary to change the `config.xml` file. This is a manifest file that contains a set of important information necessary to begin the application. It allows to change the application name, its dimensions and other fiels like author, description, acess to external resources, acess to platform functionalities, etc:

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

At first time, we will define the application's ID with this format:

```
http://widgets.tice.ipn.pt/<unique_id>
```

where the `<unique_id>` is replaced by an unique identification of yours application. So, you must replace this sufix to, for example, your username, so we grant that this ID will be unique.

You can change too the fields `name` and `description`.

### 4. Autenticação da aplicação na plataforma

In this step, we aim to authenticate with the eVida platform, using OAuth2, so furtherly we can get information about a logged user. 

To preform the OAuth2 flow we first need a Consumer Key, which indetigied your application. It should be generated in the Developer section (sidebar), API access tab.

Once you are there, click `Create another Oauth Consumer`, fill the form, submit it, and you'll be given a Consumer Key and Consumer Secret. The field `Redirection URI` may be let blank. 

Now, in your code, go to `/src/views/home_view.js` and complete the code below, by replacing `<consumer_key>` with the previously generated key.



```
requestOAuth: function(){
	oauth.setScope('user');
	//Consumer Key
	oauth.setClientID('<consumer_key');
	oauth.requestToken(this, '#oauth_btn');
	$('#my_modal').hide();
}
```

Note that the scope was set to `user`, which will tell the platform we are asking the user for permissions to access its data 





### 5. Obtaining eVida's logged user information 

In the previous step we completed the OAuth flow that asks the user for permission for the app to access its information.

Now, lets see get the actual information.


Check the file `/src/views/home_view.js` for the function:

```
requestUser: function(){
	var self = this;
 	oauth.requestUser(this.token, function(response){
 		self.user = response.user;
 	});
}
```

It uses the API that can be found it the file `/src/utils/oauth.js`. It requires the request to be authenticated with the oauth token, once it contaisn user private data.

Once we've obtained the user information, we can now manipulate the view. 



btida essa informação podemos manipular a nossa view de acordo com o username do utilizador.

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

Volte a comprimir e re-submeta a aplicação. Deverá agora ser apresentado o username do utilizador logado na aplicação.


After this tiep, we'll submit the application in the Evida platform for the first time, by creating a widget that follows the Widgets 1.0 W3C specification.

1. zip compress all your application files in your root directory (not the directory itself, its content)

2. change the extention from `.zip` to `.wgt`

3. Go to eVida, access the Developer area and click Create an app

4. Click New Packaged App

5. Upload your `.wgt `

Your app will now be available in your Developer area, under the Developed by you tab.

If everything was right, when you access your app, it will ask for your authorization to acess your own data.


### 6. Styles

The look of your application is always very important. In case you want to match it with the portal's we can provide you the proper css to achieve it.

It was developed a theme, based in the widely known Twitter bootstrap that you can acess on `https://evida.pt/css/apps/assets/bootstrap-v0.6.1.css`.

In `index.html` you should replace '<css_url'> with the proper url

```
<head>
	<meta charset="utf-8">
	<title>Get Fit</title>
	<link rel="stylesheet" href="<css_url>">
	<link rel="stylesheet" href="styles/my.css">
	
	<script data-main="main.js" src="libs/require-jquery.js"></script>
</head>
```

Now resubmit the application and you'll be able to notice changes.



### 7. Utilização da API Javascript do portal para herdar o *locale* do utilizador

In this step, the aim is to interact with the platform's JavaScript APIs.

As an example, we'll be interacting with eVida to get the language is viewing the website in.


The user can choose the language by accessing **settings**, and setting it.

The file `/src/utils/i18n.js` contains the function `setLocale` which checks for the user language and defines the proper text to display.

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

You should implement both `//TODO`, by accessing the documentation which can be found on <https://developer.evida.pt/js-api/template.html#widget-properties-api/en>.

After that, you can resubmit the app and check how it now follows user set langague.



### 8. Integração com a aplicação do PHR

To finish this workshop, we will integrate ours application with another eVida's application, called `GenericEntity`. This last application provides a `PHR` (Personal Health Record) that allows an user to store his clinical data. In this exercise we will create in ours application a graphic that contains all records about the bycicle physical exercise.

At this moment, we don't have any record about that, so we need to acess to GenericEntity application through the eVida portal and to insert measures. Through the portal web store, select the ***"Generic Entity"*** application, and acess to the menu ***"Measurements"*** and to submenu ***"Bicycle Exercise"***. You can insert, for example, three records.

Now, we will provide these measures in ours application in the form of a graphic. In the file `/src/utils/chart.js` we can see the `loadGraph` function that receives an URL and draws the desired graphic. This function is called through the file `/src/views/home_view.js`:

```
initialize: function(){
	i18n.setDefault();
	this.setToken( cookies.get() );
	loadGraph("http://core.ge.evida.pt/BicycleExercise/items?apiRequest.username=<username_here>&apiRequest.sidx=measurement_date");
}
            
```
The URL that is sent to the `loadGraph` function must to replace the field `username_here` by yours `username`. Re-submit the application and you can visualize the graphic with the submited measures.

## Resources

Necessary resources to the workshop:

* eVida platform: <https://www.evida.pt>;
* Users API URL: <https://api.evida.pt/users>;
* CSS URL: <https://evida.pt/css/apps/assets/bootstrap-v0.6.1.css>;

Other resources:

* OAuth2 protocol: <<http://oauth.net/2/>;
* Twitter Bootstrap: <http://getbootstrap.com/>;

## Contacts

The eVida technical team:

* [Diogo Lucas](mailto:dlucas@ipn.pt)
* [Miguel Oliveira](mailto:moliveira@ipn.pt)
* [Nuno Rebelo](mailto:nrebelo@ipn.pt)