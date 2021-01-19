const express=require("express")
const router=express.Router()
const { create ,categoryById,read,remove,update,list}=require("../controller/category")
const {requireSignin,isAuth,isAdmin}=require("../controller/auth")

const {userfindById}=require("../controller/user")
//const { read } = require("../controller/product")

router.get("/category/:categoryId",read)
router.put("/category/:categoryId/:userId",requireSignin,isAdmin,isAdmin,update)
router.delete("/category/:categoryId/:userId",requireSignin,isAdmin,isAdmin,remove)
router.post("/category/create/:userId", requireSignin,isAdmin,isAdmin,create)
router.get("/categorylist",list)
router.param("categoryId",categoryById)
router.param("userId",userfindById)

module.exports=router;