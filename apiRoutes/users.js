const validator = require('validator');
const utils = require('../utils');
var jwt = require('jsonwebtoken');

exports.addUser = function(req, res, err) {
  const user_name = req.body.user_name;
  const age = req.body.age;
  const password = req.body.password;
  const isNewUserValidated = validateAddUser(user_name, age, password)
  if (!isNewUserValidated.isError) {
    const password_hash = utils.hashPassword(password);
    const data = [user_name, age, password_hash]
    
    //Check whether username already exists
    let sql = `SELECT * FROM Users WHERE user_name = '${user_name}'`
    let query = db.query(sql, (err, results) => {
      if(err) throw err;
      if(results.length){
        res.status(500).json({
          error:
          {
            user_name: "username already in use"
          }
        });
        console.log('User exists error')
      } else {
        //insert new user if username is unique
        let insertSql = `INSERT INTO Users (user_name, age, password_hash, created_date) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
        let insertQuery = db.query(insertSql, data, (error, resultData) => {
          if(error) throw error;

          //generate token that will be valid for 24hrs
          const webToken = jwt.sign({user_name: user_name}, req.app.get("superSecret"), {
            expiresIn : 60*24
          })
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: webToken,
            error: null
          });
          console.log('User added successfully');
        })
      }
    });
  }
  else {
      res.status(500).json({ error: isNewUserValidated });
      console.log('User add error')
  }
}

exports.getUsers = function(req, res) {
  if(req.method == "GET"){
    let sql = 'SELECT * FROM Users';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send(results);
    });
  }
};

exports.removeUsersTable = function(req, res) {
  let sql = 'DROP TABLE Users';
  let query = db.query(sql, (err, results) => {
    if(err) throw err;
    console.log(results);
    res.send('Users table deleted …');
  });
}

exports.createUsersTable = function(req, res) {
  let sql = `CREATE TABLE IF NOT EXISTS Users (ID int primary key auto_increment, 
    user_name varchar(255) NOT NULL, age int NOT NULL, 
    password_hash int NOT NULL, 
    created_date datetime NOT NULL)`;
  let query = db.query(sql, (err, results) => {
    if(err) throw err;
    console.log(results);
    res.send('Users table created …');
  });
}

const validateAddUser = function(user_name, age, password) {
  let errors = {
    isError: false,
    user_name: null,
    password: null,
    age: null
  };
  if (validator.isEmpty(user_name)) {
    errors.isError = true
    errors.user_name = "You must enter a username."
  }
  if (!utils.isInteger(age)) {
    errors.isError = true
    errors.age = "You must enter a valid age."
  }
  if (validator.isEmpty(password)) {
    errors.isError = true
    errors.password = "You must enter a password."
  }
  return errors;
}