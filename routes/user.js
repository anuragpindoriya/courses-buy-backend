const {Router} = require('express')
const {User} = require('../db/index')
const router = Router()
router.post('/signup',async (req,res)=>{
    console.log(req.header)
    const username = req.header('username')
    const password = req.header('password')
    if(!username || !password){
        res.status(400).json({message:'Username and password are required'})
    }
    try {
        const userExists = await User.findOne({username})
        console.log(userExists)
        if(userExists){
            return res.status(400).json({message:'User already exists'})
        }
        const newUser = new User({username,password})
        await newUser.save()
        res.status(201).json({ message: "User registered successfully" });
    }catch(e){
        res.status(500).json({ message: "Error registering user", error: e.message });
    }
})

router.get('/courses',(req,res)=>{
    res.json({message:'Courses route'})
    User.findOne()
})

router.post('/courses/:courseId',(req,res)=>{

    res.json({message:`successfully purchase course ,req:${req}`})
})

router.get('/purchased-courses',(req,res)=>{
    res.json({message:" you have 3 purchase courses"})
})


module.exports = router