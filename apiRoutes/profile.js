const jwt = require('jsonwebtoken');

exports.getUserProfile = function(req, res, next) {
  var token = (req.body && req.body.access_token) || 
  (req.query && req.query.access_token) || 
  req.headers['x-access-token'];
  if (token) {
    try {
      jwt.verify(token, req.app.get('superSecret'), function(err, verifiedJwt){
        if(err){
          console.log(err); // Token has expired, has been tampered with, etc
        }else{
          let sql = `SELECT * FROM Users WHERE user_name = '${verifiedJwt.user_name}'`;
          let query = db.query(sql, (err, results) => {
              if(err) throw err;
              user = results[0];
              res.status(200).send({
                id: user.id,
                user_name: user.user_name,
                age: user.age,
                created_date: user.created_date
              });
          });
        }
      });
    } catch (err) {
      res.status(500).send({
        error: err
      })
      return next();
    }
  } else {
    next();
  }
};