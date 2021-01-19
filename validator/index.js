const expressValidator=require("express-validator")
const express=require("express")
exports.usersignupValidator=(req,res,next)=>{
    req.check('name',"Name is required").notEmpty()
    req.check('email',"Email must be between 3 to 32 charactors ")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min:4,max:32
    })
    req.check('password',"password is required").notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage("password must contain atleast 6 charactor")
    .matches(/\d/)
    .withMessage("password must contain a number")
    const errors=req.validationErrors()
    if(errors)
    {
        const firstError=errors.map(error=>error.msg)[0]
        return res.status(400).json({error:firstError})
    }
    next()
}