# Delilah Resto API

REST API for a restaurant's online ordering system, made with node.js and express.

#### [Oficial API Documentation](https://documenter.getpostman.com/view/12197996/TVKFzwCU)

#### Database Diagram

### Installation Requirements

-  Node.js: API compatible with version 12.18.3.
-  Server: You could use [XAAMP](https://www.apachefriends.org/es/index.html) to manage the server.
-  MySQL database engine: You can run the database with phpmyadmin through XAAMP. A database creation script named `delilah-resto.sql` is included in the sql folder with the database structure.

### Step by Step Installation

The following installations steps will be explained using XAAMP and phpmyadmin.

1. Download the files or clone the repository to a folder in your server using:  
   `git clone [https://github.com/JMAlejandra/delilah_resto.git]`

2. Open the command line in the folder where you saved the files and run
   `npm install`

3. Once the dependencies have been installed, we will create the environment variable needed for the token creation process. To do this, you will need to run the command

   `[Environment]::SetEnvironmentVariable("ACCESS_TOKEN_SECRET", "[YOUR_SECRET]", "Process")`

   Substituting the string `"[YOUR_SECRET]"` with what you wish to use to handle token encryption. To generate a secret for the process you can run the following code in the terminal

   `node`  
   `require('crypto').randomBytes(64).toString('hex')`

   After that, copy and paste the string into the Environment Variable code and paste it into the terminal. Press enter to create the variable. Here is an example of the code ran on a powershell terminal.

   ![6](https://i.imgur.com/rVvTymg.png)

4. Open XAAMP and start the Apache and MySQL services and wait for them to start.

![1](https://i.imgur.com/yCW8GW1.png)
![2](https://i.imgur.com/4W2eYuO.png)

5. Go to [https://localhost/phpmyadmin/index.php](http://localhost/phpmyadmin/index.php) to open the phpmyadmin administration site.

6. The following steps will create the database schema that will be used to store the information in the API, as well as an generic admin user to manage permissions. To begin this process, select the ![4](https://i.imgur.com/DKUbTVM.png) option in the phpmyadmin menu.

![3](https://i.imgur.com/PSV0lsy.png)

7. In the Import Screen, click on "Browse" and, once the open dialogue box opens, select the `delilah-resto.sql` file from your project's `sql` folder.

![7](https://i.imgur.com/4l2Hg8t.png)

8. Once the file has been selected, go to the bottom right side of the page and click on the ![image](https://i.imgur.com/O5i5VnP.png) button to begin the import process. You should get the following response

![9](https://i.imgur.com/yMtq7cm.png)

9. By default the database creation script creates the table structure in a database named `delilahresto`. If you choose to use a different database or want to add more security and permissions through setting database users, you must modify the `config.json` file in the main folder of the project. In it you can specify the different attributes of the database connection. However, the default values in the file will allow you to create a successful connection to the mysql database.

![13](https://i.imgur.com/Lg9Q3BQ.png)

10. After completing the previous steps, you will need to start the node.js server. To do this, open a terminal from inside your project's main folder and run the following code `node server.js`. If successfull, you should get a message stating `Server is up and running`

![10](https://i.imgur.com/1LgVre7.png)

It is important to note that you must leep the terminal open while the server is functional. Closing the terminal will shut off the server and any calls made to the API will not respond properly.

### Testing Endpoints

In order to test the API, you can use Postman to view the different endpoints and responses. The documentation for the Delilah Resto API can be found [here](https://documenter.getpostman.com/view/12197996/TVKFzwCU). It includes information on the different endpoints available.

During the database creation process, a generic admin user was created. This user can be used to grant permissions to new users created through the API. The credentials for this user are as follows:

```
"user_credential": "admin",
"user_password": "admin"
```

The login process for the admin user will be exemplified using postman.

First, we will add to the body of the request the user credentials shown before for the admin user. The request will be made to the `localhost:3000/users/login` URL. Once those are added to the postman request, you can press the "Send" button to send the request to the server.

In the following images you can see highlighted in yellow the required inputs and the URL to which the request will be sent. In green you can see the response sent from the server, which includes a `User logged in succesfully` message in the body of the response, and an `Authorization` header with a `Bearer Token` that can be sent with future requests to other endpoints that require authorization.

![11](https://i.imgur.com/Z2GNN4C.png)
![12](https://i.imgur.com/zjXnmFA.png)

The login endpoint does not require an authentication token to be sent with the request, but most endpoints in the API do. For more information, you can see examples in the API [documentation](https://documenter.getpostman.com/view/12197996/TVKFzwCU).

### Other notes

-  If you wish to close the server, close the terminal and that will terminate the service.
-  In case you wish to add some basic data to the database for testing purposes, there is a file called `delilah-resto-test-data.sql` that you can import into the database once the database structure is created. This is not necessary for the proper functioning of the server, but it provides some data that can be manipulated through the different end points.
