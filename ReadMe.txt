	### 		Node.js REST API for demonstrating role-based login & registration functions using JSON Web Token, Sequelize, MySQL	###


JSON Web Token replaces the User session stored in a cookie or in a Session object for managing login functions, and managing access levels to site content. The token is stored on the client side, and is sent in the header in each HTTP request. For the purposes of an API accessing a microservice, this is ideal: no additional authentification methods to implement in the backend; either the token is present in request header, and the server validates it and returns the content to the User, or the token is not present, and the server does not display the protected content, replying instead with the appropriate 403 error message.


Required technologies:

Node.js
NPM
Express
bcryptjs
jsonwebtoken
Sequelize
MySQL



-----------------Setup-----------------
	
 - Create MySQL database


 - Add name of database, username and password values to file at:

	..\app\config\db.config.js 


 - Install Node.js and NPM (varies according to operating system; the following instructions apply to Windows machines)

 - Ensure other technologies are installed:


	in commandd line:

	npm install express sequelize cors jsonwebtoken bcryptjs mysql2 --save

Before the next step, ensure to close any processes that also use the 8080 port (ex Tomcat server)


 - open command line programme, and navigate to the root folder of this app

	node server.js
	
The console should show:

	"Server is running on port 8080.
	Successfully connected to the database."

-----------------To use the programme-------------



The roles our programme will use are 'User', 'Editor', 'Admin'; first create some Users with these roles. 'Roles' and 'Users' have a 'many-to-many' relationship (any User can have one or more Roles).


-Open Postman, or similar programme 

(the data being submitted in each case is in JSON, so please ensure that you select this option in the 'Body' tab of the request).



POST 		http://localhost:8080/api/auth/register

{
    "firstname": "John",
    "surname": "Boss",
    "email": "boss@mail.com",
    "password": "P12345678#",
    "roles": ["user","editor","admin"]
    
}


Response:
{
	"message":
	"User was registered successfully!"
}


Add a user without any array of roles - remember if there is no array of roles specified, the visitor is saved as a User by default


POST		http://localhost:8080/api/auth/register


{
    "firstname": "Mark",
    "surname": "User",
    "email": "plainUser@mail.com",
    "password": "P12345678#"
    
    
}

Response:
{
	"message":
	"User was registered successfully!"
}




 - Add one User with an array of roles containing just "user" to test this also


POST http://localhost:8080/api/auth/register


{
    "firstname": "Dave",
    "surname": "d'User",
    "email": "d_user@mail.com",
    "password": "P12345678#",
	"roles": ["user"]
    
    
}

Response:
{
	"message":
	"User was registered successfully!"
}



 - Attempting to add a User with the the "d_user@mail.com" mail for a second time should receive an error message



POST		http://localhost:8080/api/auth/register

{
    "firstname": "Dee",
    "surname": "d'User",
    "email": "d_user@mail.com",
    "password": "P12345678#",
	"roles": ["user"]
    
    
}

Response:

{
    "message": "Failed! Email is already in use!"
}



Attempt to login with email that is not associated with any User (but with a password that is)



POST		http://localhost:8080/api/auth/signin
{
    
    "email": "1234Wrong@mail.com",
	"password": "P12345678#"
    
    
}

Response:

{
    "message": "User Not found."
}


 - Attempt to login with correct email but incorrect password

POST		http://localhost:8080/api/auth/signin


{
    
    "email": "d_user@mail.com",
	"password": "wrongPass"
    
    
}


Response:

{
    "accessToken": null,
    "message": "Incorrect password!"
}


-----------------------------------------------------

-----------------test the 'GET' calls-----------------


Accessing content that is viewable by all site visitors (not signed-in)

GET		http://localhost:8080/api/test/all

(no body)


Response:

"Content for all site Visitors"






Attempt to access content that is only viewable by signed-in users (while not signed-in)


GET		http://localhost:8080/api/test/user

(no body)

Response:

{
    "message": "No token found!"
}







Attempt to login using correct email/password 


POST	http://localhost:8080/api/auth/signin

{
    "email" : "d_user@mail.com",
    "password": "P12345678#"
}



response:

{
    "id": 4,
    "email": "d_user@mail.com",
    "roles": [
        "ROLE_USER"
    ],
    "firstname": "Dave",
    "surname": "d'User",
    "accessToken": "eyJhbGci..."	[your actual token code will differ]		"
}


------------

-this accessToken needs to be included in the header of our HTTP request in order to access content reserved for signed-in users


In Postman, go to 'headers' tab of the request

	KEY
	x-access-token
	
	VALUE
	eyJhbGci...	[your actual token code will differ]		


GET		http://localhost:8080/api/test/user




(empty body)



Response:

"Content for all signed-in Users"


-------------------------------


If we try using the same content to access content reserved for Admins or Editors we will receive an error message


	KEY
	x-access-token
	
	VALUE
	eyJhbGci...	[your actual token code will differ]

GET		http://localhost:8080/api/test/admin


(empty body)



Response:


{
    "message": "Sorry, must be an Admin to access!"
}


-----------------------------------------------------



Sign in as Admin and attempt to access the same content using the Admin's access token


POST		http://localhost:8080/api/auth/signin


{
    "email" : "boss@mail.com",
    "password": "P12345678#"
}


response:


{
    "id": 1,
    "email": "boss@mail.com",
    "roles": [
        "ROLE_USER",
        "ROLE_EDITOR",
        "ROLE_ADMIN"
    ],
    "firstname": "John",
    "surname": "Boss",
    "accessToken": "eyJhb...	[your actual token code will differ ]"
}


Header:

	KEY
	x-access-token
	
	VALUE
	eyJhb...	[your actual token code will differ ]

GET		http://localhost:8080/api/test/admin


(empty body)



Response:


Content for Admins


-Make sure to save this accessToken, as we will need it for testing our next method







-----------------Delete User-----------------

An Admin has the power to delete other Users

-First add another couple of Users using the /register call above (you can give them any details you like, so long as you use a new email each time)



Header:

KEY
	x-access-token
	
VALUE
	eyJhb...	[Admin accessToken]


DELETE		http://localhost:8080/api/admin/delete/4 




Response
{
    "message": "User #4 was successfully deleted."
}

---------------------------------------

If we try to make a delete call without including an access token


DELETE		http://localhost:8080/api/admin/delete/5 



{
    "message": "No token found!"
}


-----------------------

If we sigin in as a Role other than Admin (such as Editor), and try to make a DELETE call using this token

 - First we register an Editor

POST 		http://localhost:8080/api/auth/register


{
    "firstname": "Edward",
    "surname": "Editing",
    "email": "editit@mail.com",
    "password": "P12345678#",
	"roles": ["user", "editor"]
    
    
}


- Login as this Editor


POST	 	http://localhost:8080/api/auth/signin

{
    "email": "editit@mail.com",
    "password": "P12345678#"
}


Response:

{
    "id": 6,
    "email": "editit@mail.com",
    "roles": [
        "ROLE_USER",
        "ROLE_EDITOR"
    ],
    "firstname": "Edward",
    "surname": "Editing",
    "accessToken": "eyJhbGciO...[Editor token]."
}



Now, attempt to delete a User using this Editor's token



KEY
	x-access-token
	
VALUE
	eyJhbGci... [Editor Token]	


DELETE		http://localhost:8080/api/admin/delete/5
	
	
	
	Response:
	
	{
		"message": "Sorry, must be an Admin to access!"
	}



-----------------------------------------------------------------------------

Sources:

https://www.bezkoder.com/node-js-rest-api-express-mysql/
https://www.bezkoder.com/node-js-jwt-authentication-mysql/
https://sebhastian.com/sequelize-delete-by-id/



