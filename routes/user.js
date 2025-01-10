const {Router} = require('express')
const {User} = require('../db/index')
const userMiddleware = require("../middleware/user");
const {Course} = require("../db");
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

router.get('/courses',userMiddleware,async (req,res)=>{
    const {username} = req.headers
    const userDetail = await User.findOne({username});

    res.json({message:'Courses route',parchasedCourse:userDetail.parchasedCourse})
    // User.findOne()
})

router.post('/courses/:courseId',userMiddleware,async (req,res)=>{
    const {username} = req.headers
    const courseId = req.params.courseId

    const userDetail = await User.findOne({username})
    if(userDetail.parchasedCourse.includes(req.params.courseId)) {
        return res.status(400).json({message:'Course already purchased'})
    }
    await User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    })
    res.json({
        message: "Purchase complete!"
    })
})

router.get('/purchased-courses',userMiddleware,async (req,res)=>{
    const userPurchasedCourseCourses = res.user.parchasedCourse
    const purchasedCourse = await Course.find({_id:{$in:userPurchasedCourseCourses}})
    console.log(purchasedCourse)
    res.json({message:'Purchased courses'})
})


module.exports = router