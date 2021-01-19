const express=require("express")
const router=express.Router()
const { create,productById ,read,remove,update,list,ListRelated,
    ListCategories,listBySearch,photo}=require("../controller/product")
const {requireSignin,isAuth,isAdmin}=require("../controller/auth")

const {userfindById}=require("../controller/user")

router.get("/product/:productId",read)
router.post("/product/create/:userId", requireSignin,isAdmin,isAdmin,create)
router.delete("/product/:productId/:userId",requireSignin,isAdmin,isAdmin,remove)
router.put("/product/:productId/:userId",requireSignin,isAdmin,isAdmin,update)
router.get("/products",list)
router.get("/products/related/:productId",ListRelated)
router.get("/products/categories",ListCategories)
router.post("/products/by/search",listBySearch)
router.get("/product/photo/:productId",photo)


router.param("userId",userfindById)
router.param("productId",productById)

module.exports=router;