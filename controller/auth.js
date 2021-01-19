const User=require("../model/user")
const jwt=require("jsonwebtoken")//for generate token
const expressjwt=require("express-jwt") // used for autherization check
//const errorHandler=require("../helpers/dbErrorhandler")
/*exports.signup=(req,res)=>{
   const user=new User(req.body) 
   user.save((err,use)=>{
       if(err)
       {
           return res.status(400).json({message:errorHandler(err)})
           
       }
       res.json({user})
   })
}*/

exports.signup = (req, res, next) => {
    User.create(req.body, (error, data) => {
      if (error) {
             
            
               res.json({message:"something wrong"})

             
        //return res.json({message:error});
      } else {
        data.salt=undefined
        data.hased_password=undefined
        return res.json(data);
      }
    })
  }


  exports.signin=(req,res)=>{
// find user base on email
const {email,password}=req.body;
User.findOne({email},(err,user)=>{
  if(err||!user)
  {
    return res.status(400).json({
      message:"user with this email id is not exist please signup again"
    })
  }

  //if user is found make usre the email and password match

  //create authenticate method in user model
  if(!user.authenticate(password)){
    return res.status(401).json({message:"Email and Password does not match"})
  }


  //generate a token with user id and secrete
  const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)

  //persist the token with any name like t
  res.cookie("t",token,{expire:new Date() + 9999})
  //return respose with user to front end client
  const {_id,name,email,role}=user 
  return res.json({token,user:{_id,name,email,role}})
})
  }

  exports.signout=(req,res)=>{
    res.clearCookie('t')
    res.json({message:"signout successful"})
  }
  

  exports.requireSignin=expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty:"auth"
  })

  exports.isAuth=(req,res,next)=>{
    const user=req.profile&&req.auth&&req.profile._id==req.auth._id//it return tru or false
    if(!user)
    {
      return res.status(403).json({message:"Access Denide"})
    }
    next()
  }

  exports.isAdmin=(req,res,next)=>{
    if(req.profile.role===0)
    {
      return res.status(403).json({message:"Admin Resouce! Access Denide"})
    }
    next()
  }
  