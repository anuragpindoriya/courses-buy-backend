const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {Admin, Course} = require("../db");
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

router.post('/courses', adminMiddleware, async (req, res) => {
    const body = req.body
    console.log(body.title)
    try {
        if(!body.title || !body.price || !body.description || !body.imageLink){
            return res.status(400).json({message:'All fields are required'})
        }
        const createNewCourse = new Course({title:body.title,price:body.price,description:body.description,imageLink:body.imageLink})
        console.log(createNewCourse)
        await createNewCourse.save()
        res.status(200).json({ message: "Course created successfully" ,courseId:createNewCourse._id});
    }catch(e){
            res.status(500).json({ message: "Error creating course", error: e.message });
    }

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement admin get courses logic
    const allCourses = await Course.find({})
    if(allCourses){
        return res.status(200).json(allCourses.map((res)=>({...res['_doc'],published:true})))
    }
    res.status(400).json({message:'No courses found'})
});

module.exports = router;