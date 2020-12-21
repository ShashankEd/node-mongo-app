const jwt = require("jsonwebtoken");
/**
 * Method to generate access toekn 
 * @param {*} username 
 */
const generateJWTToken = (username) => {
    console.log("user name ", username);
    try {
        return jwt.sign(username, process.env.TOKEN_SECRET);
    } catch(e) {
        console.log("error in generateJWTToken ", e);
    }
   
} 
//shubham gupta
//validate token
const validateJWTToken = (token , res) => {
    if (token == null) {
        return res.sendStatus(401) // if there isn't any token

    } else{
        jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
            if (err) {
                console.log("Error is ", err)
                return res.sendStatus(403)
            } else {
                console.log("user ", user);
                return res.json({"data":{
                    "status": "Hi "+ user + " You're successfully logged in!"
                }})
            }
          })
    }
}
const genricJWTValidator = (token ) => {
    if (token == null) {
        return null // if there isn't any token

    } else{
        jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
            if (err) {
                return false
            } else {
                return true
            }
          })
    }
}
exports.genricJWTValidator = genricJWTValidator;
exports.validateJWTToken = validateJWTToken;
exports.generateJWTToken = generateJWTToken;  