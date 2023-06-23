const jwt = require("jsonwebtoken");
require("dotenv").config();

//verification mechanism
const verifyToken = function (req, res, next) {
  //get Bearer token from req
  let bearerToken = req.headers.authorization;
  //check for bearer token
  if (bearerToken === undefined) {
    res.send({ message: "Unauthorizes access. Plz login" });
  } else {
    //get token from bearer token
    let token = bearerToken.split(" ")[1];
    try {
      //verify the token
      let decodedToken = jwt.verify(token, process.env.SECRET);
      //call next middleware
      next();
    } catch (err) {
      res.send({ message: "Invalid token. Plz relogin" });
    }
  }
};

module.exports = verifyToken;
