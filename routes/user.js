const express=require("express")
const router=express.Router()
const {userfindById,read,update}=require("../controller/user")
const {requireSignin,isAuth,isAdmin}=require("../controller/auth")


router.get("/secret/:userId", requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({
        user:req.profile
    })
})
router.param("userId",userfindById)
router.get("/user/:userId",requireSignin,isAuth ,read)
router.put("/user/:userId",requireSignin,isAuth ,update)

module.exports=router;