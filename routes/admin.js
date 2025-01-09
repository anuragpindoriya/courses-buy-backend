const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {Admin} = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.header('username')
    const password = req.header('password')
    if(!username || !password){
        res.status(400).json({message:'Username and password are required'})
    }
    try{
        const adminExists = await Admin.findOne({username})
        if(adminExists){
            return res.status(400).json({message:'Admin already exists'})
        }
        const newAdmin = new Admin({username,password})
        await newAdmin.save()
        res.status(200).json({ message: "Admin registered successfully" });
    }catch(e){
        res.status(500).json({ message: "Error registering admin", error: e.message });
    }

});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;