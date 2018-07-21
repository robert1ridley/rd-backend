const validator = require('validator');
const utils = require('../utils');

exports.addUser = function(req, res, err) {
  const user_name = req.body.user_name;
  const age = req.body.age;
  const password = req.body.password;
  const isNewUserValidated = validateAddUser(user_name, age, password)
  if (Object.keys(isNewUserValidated).length === 0) {
    const password_hash = utils.hashPassword(password);
    const data = [user_name, age, password_hash]
    
    //Check whether username already exists
    let sql = `SELECT * FROM Users WHERE user_name = '${user_name}'`
    let query = db.query(sql, (err, results) => {
      if(err) throw err;
      if(results.length){
        res.status(500).send({ error: {user_exists: "username already in use"} });
        console.log('User add error')
      } else {
        //insert new user if username is unique
        let insertSql = `INSERT INTO Users (user_name, age, password_hash, created_date) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
        let insertQuery = db.query(insertSql, data, (error, resultData) => {
          if(error) throw error;
          req.session.user = {users_name: user_name, age: age};
          res.status(200).json({success: true, status: 'New user added successfully'});
          console.log('User added successfully');
        })
      }
    });
  }
  else {
      res.status(500).send({ error: isNewUserValidated });
      console.log('User add error')
  }
}

exports.getUsers = function(req, res) {
  if(req.method == "GET"){
    let sql = 'SELECT * FROM Users';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results);
        res.send('Users fetched …');
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
  let errors = {};
  if (validator.isEmpty(user_name)) {
    errors.user_name = "You must enter a username."
  }
  if (!utils.isInteger(age)) {
    errors.age = "You must enter a valid age."
  }
  if (validator.isEmpty(password)) {
    errors.password = "You must enter a password."
  }
  return errors;
}