const {Admin}= require('../db/index') ;
async function adminMiddleware(req,res,next){
    try{
        const { username, password } = req.headers;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required in headers" });
        }
        const adminExist = await Admin.findOne({ username });
        if (!adminExist) {
            return res.status(401).json({ message: "Admin not found" });
        }
        if (password !== adminExist.password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        req.admin = adminExist;
        next();
    }catch(e){
        res.status(500).json({message:'Internal server error'})
    }
}
module.exports = adminMiddleware;