const {User} = require("../db");

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const { username, password } = req.headers;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required in headers" });
    }
    const userExist = User.findOne({username})
    if(userExist){
        return res.status(401).json({message:'User not found'})
    }
    if(password !== userExist.password){
        return res.status(401).json({message:'Invalid password'})
    }
    res.user = userExist;
    next();
}

module.exports = userMiddleware;