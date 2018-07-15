const express = require('express');
const mysql = require('mysql');
const users = require('./apiRoutes/users');
const bodyParser = require('body-parser');

//Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345',
    database : 'RandD'
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