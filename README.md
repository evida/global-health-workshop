# Workshop - eVida platform - 20 November 2013

## Introduction

In this workshop we assume that the user is familiar with the concept and the goals of the eVida plataform, as well as the two application types that it supports: hosted and packaged.

During this workshop, you will create an account in the eVida platform, learn how to interact with it and how to deploy a packaged application. 

At the bottom of this document, you can find a list of important resources that can help both to get through the tutorial or when you are developing your own apps.

Please feel free to ask any question through the workshop, or later by writing us to ajuda@evida.pt.

## Exercises

### 1. Create a new account on the eVida platform

The first step of this workshop aims to create an user account on the eVida platform. Go to <https://www.evida.pt> and register an account. As a logged user you can access the platform's web store.

By default, when an user acess for the first time to the plataform, the account is set to as a developer account. In this workshop we intend to develop an application, so we need to have a developer account. Log in, go to  ***"Settings"*** in the sidebar, then ***"Developer Settings"*** and toggle the option ***"Connect this account to a developer account"*** to ***"Yes"***.

### 2. Obtain the skeleton of the packaged application

In this step you will download the skeleton code of the application to be developed. You can find this code in `exercises/Skeleton` folder on <https://github.com/evida/global-health-workshop>.

### 3. Application configuration

Packaged apps need to have a properly configured `config.xml` file, which is a manifest file that contains a set of important information about the application.

There, you can change the application name, its dimensions and other fields like author, description, logo, etc:

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

As a first step, define the application's ID, following the format:

```
http://widgets.tice.ipn.pt/<unique_id>
```

where the `<unique_id>` should replaced by an unique identification of your application. This id will be used by eVida to identify your app, which will have the url: `https://www.evida.pt/app/<unique_id>`.

For the purpose of this workshop, we suggest you to replace the sufix `<unique_id>` with your username, so we assure that this ID will be unique.

You can also hange too the fields `name` and `description`.

### 4. User authorization

In this step, we aim to authenticate with the eVida platform using OAuth2, so furtherly we can get information about a logged user. 

To perform the OAuth2 flow, we first need a Consumer Key, which identifies your application. It should be generated in the ***"Developer"*** section (sidebar), ***"API access"*** tab.

Once you are there, click ***"Create another Oauth Consumer"***, fill the form, submit it, and you'll be given a ***"Consumer Key"*** and ***"Consumer Secret"***. The field `Redirection URI` may be left blank. 

Now, in your code, go to `/src/views/home_view.js` and complete the code below, by replacing `<consumer_key>` with the previously generated Consumer Key.



```
requestOAuth: function(){
	oauth.setScope('user');
	//Consumer Key
	oauth.setClientID('<consumer_key>');
	oauth.requestToken(this, '#oauth_btn');
	$('#my_modal').hide();
}
```

Note that the scope was set to `user`, which will tell the platform we are asking the user for permissions to access its data.



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

It uses the API that can be found it the file `/src/utils/oauth.js`. It requires the request to be authenticated with the oauth token, once it contains user private data.

Once we've obtained the user information, we can now manipulate the view. 


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

You should replace the field `<users_api_url>` by the url to the eVida users's API, which is `https://api.evida.pt/users`.

Now go back to `/src/views/home_view.js`. The object `response` contains the information from the `user` using the application. It is possible to get its `username` with `user.username`.

```
self.user = response.user;

```

Create an `alert` that shows the `username` when the application starts.

After this step, we'll submit the application in the eVida platform for the first time, by creating a widget that follows the Widgets 1.0 W3C specification.

1. zip compress all your application files in your root directory (not the directory itself, its content)

2. change the extension from `.zip` to `.wgt`

3. Go to eVida, access the Developer area and click Create an app

4. Click New Packaged App

5. Upload your `.wgt `

Your app will now be available in your ***"Developer"*** area, under the ***"Developed by you"*** tab.

All going well, when you access your app, it will ask for your authorisation to access your own data and display an alert with your username.


### 6. Styles

The look of your application is always very important. In case you want to match it with the portal's we can provide you the proper css to achieve it.

It was developed a theme, based in the widely known Twitter Bootstrap, that you can acess on `https://evida.pt/css/apps/assets/bootstrap-v0.6.1.css`.

In `index.html` you should replace `<css_url>` with the proper url

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



### 7. API Javascript interaction 

In this step the aim is to interact with the platform's JavaScript APIs.

As an example, we'll be interacting with eVida to get the language is viewing the website in.

The user can choose the language by accessing ***"Settings"***.

The file `/src/utils/i18n.js` contains the function `setLocale` which checks for the user language and defines the proper text to display.

```
setLocale: function(){
	var self = this;
	//TODO: call the Javascript API method to get locale
	$c().services("<api_method>", {}, function(args) {
		self.locale = args[0];
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

You should replace `<api_method>` with the correct API method, which can be found in the documentation page: <https://developer.evida.pt/js-api/template.html#widget-properties-api/en>.

After that, you can resubmit the app and check how it now follows user set language.



### 8. PHR integration

To finish this workshop, we will integrate our application with another eVida application, called `GenericEntity`. This last application provides a `PHR` (Personal Health Record) that allows the user to store its clinical data. In this exercise, we will create a chart that contains all records about bicycle physical exercise.

At this point, we don't have any records, so we need to access to GenericEntity application through the eVida portal and insert some data.

Through the portal web store, select the ***"Generic Entity"*** application, and access to the menu ***"Measurements"*** and to submenu ***"Bicycle Exercise"***. You can insert, for example, three records.

Now, we will handle these measurements in our application chart. In the file `/src/utils/chart.js` you can find the `loadGraph` function that receives an URL and draws the desired chart properly. This function is called through the file `/src/views/home_view.js`:

```
initialize: function(){
	i18n.setDefault();
	this.setToken( cookies.get() );
	loadGraph("http://core.ge.evida.pt/BicycleExercise/items?apiRequest.username=insert_username_here&apiRequest.sidx=measurement_date");
}
            
```

In the URL that is sent to the `loadGraph` function must  replace the field `insert_username_here` by your `username`.

Re-submit the application and you can visualize the graphic with the submited measurments.

## Resources

Necessary resources to the workshop:

* eVida platform: <https://www.evida.pt>;
* Users API URL: <https://api.evida.pt/users>;
* CSS URL: <https://evida.pt/css/apps/assets/bootstrap-v0.6.1.css>;

Other resources:

* OAuth2 protocol: <http://oauth.net/2/>;
* Twitter Bootstrap: <http://getbootstrap.com/>;

## Contacts

The eVida technical team:

* [Diogo Lucas](mailto:dlucas@ipn.pt)
* [Miguel Oliveira](mailto:moliveira@ipn.pt)
* [Nuno Rebelo](mailto:nrebelo@ipn.pt)