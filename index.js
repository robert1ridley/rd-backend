const express = require('express');
const mysql = require('mysql');
const users = require('./apiRoutes/users');
const bodyParser = require('body-parser');
require("dotenv").config();

//import environment variables for database
var DB_HOST = process.env.DB_HOST;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD;
var DB_DATABASE = process.env.DB_DATABASE;

//Create connection
const db = mysql.createConnection({
    host     : DB_HOST,
    user     : DB_USER,
    password : DB_PASSWORD,
    database : DB_DATABASE
});

//Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

global.db = db;
const app = express();

//APIS
app.post('/adduser', bodyParser.json(), users.addUser);
app.get('/getusers', users.getUsers);
app.get('/removeusertable', users.removeUsersTable);
app.get('/createuserstable', users.createUsersTable);

app.listen('3001', () => {
    console.log('Server started on port 3001');
});