const express=require("express")
const router=express.Router()
const {signup,signin,signout, requireSignin}=require("../controller/auth")
const {usersignupValidator}=require("../validator")

router.post("/signup",usersignupValidator,  signup)
router.post("/signin",signin)
router.get("/signout",signout)

/*router.get("/hai",requireSignin,(req,res)=>{
    res.send("hello their")
})*/

module.exports=router;