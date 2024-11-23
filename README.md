# ts-node-ecommerce-api
RESTful API for e-commerce platform. This API is responsible for managing products, handling user authentication and processing orders. The goal is to create a scalable ecure and efficient API that adheres to RESTful principles

## GitHub Repository
https://github.com/potterinc/ts-node-ecommerce-api.git

## Live Deployments
https://ts-node-ecommerce.onrender.com/

## API Documentation:
https://www.postman.com/harryp30/workspace/ecommerce

## Starting the application
to run this application on your local machine using local environment
follow these steps. 
### using npm
after successful installation of packages using `npm install` and as well making sure all the environmental variables are loaded accordingly from the `.env` file. 
run `npm run dev` to start the development server.

### using yarn
run `yarn install` to install fependencies following with `yarn dev` to start the server on development mode. 

## API ENDPOINTS
### User Registration
User registration process
User registers with Telephone number using E.166 ISO format `+<dial-code><MSSID>`

A verification code will be sent via sms to the recipient number. 

After validation of the code, the final step of registration continues where the user enters its personal information. Upon successful creation of account a wallet will created for the user in order to make purchase. 

For the sake of this demo the wallet was credited with NGN1,000,000 in order to be able to make make purchases. 

All routes are protected using token based authentication and authorization logic. 

Upon successful user login a token is authorized where the user can pass in to the header for accessing other secured endpoints. 
