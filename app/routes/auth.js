var user = require('../models').user;
var authToken = require('../models').authTokens;
var secret = require('../../config').secret;
var CryptoJS = require("crypto-js");
var hat = require('hat');

 
var auth = {
 
  login: function(req, res) {
 
    var email = req.body.email || '';
    var password = req.body.password || '';
  
    // If nothing parsed, return json obj
    if (email == '' || password == '') {
      console.log("1");
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    
    // Fire a query to your DB and check if the credentials are valid
    auth.validateUser(email, password)
    .catch(function (err) {
      console.log(err);

      return err;
    })
    .then(function(dbUserObj) {
      
      // // If it's empty then return 401 auth failure
      // if ($.isEmptyObject(dbUserObj)) { // If authentication fails, we send a 401 back
      //   res.status(401).json({
      //     "status": 401,
      //     "message": "Invalid credentials"
      //   });
      //   return;
      // }

      console.log("\nUser is valid");
      
      // If the user is valid then create auth token
      authToken.create({ userId: dbUserObj[0].userId, token: genToken()})
      .then(function(results){
        res.status(200).json("token", results.token);
      })
      .catch(function(err){
          res.status(400).json("error", "something has gone wrong");
          console.log(err);
          return;
      }); 

    });
  },
  validateUser: function(email, password) {
    var cryptoPassword = CryptoJS.SHA256(password, email).toString();

    // Return the promises to our other function
    return user.findAll({
      where: {
        email : email,
        password : cryptoPassword
      },
      raw: true
    });
  },
  validateToken: function(key){
      return authToken.findAll({
        where: {
          token: key
        }, 
        raw: true
      });
  }
}
 
// private method
function genToken() {
    console.log(CryptoJS.SHA256(hat()).toString());
    return CryptoJS.SHA256(hat()).toString();
}
 
module.exports = auth;