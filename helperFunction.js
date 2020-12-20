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
exports.generateJWTToken = generateJWTToken;  