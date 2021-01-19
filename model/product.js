const mongoose=require("mongoose")
const Category=require("./category")
const {ObjectId}=mongoose.Schema

const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        required:true,
        maxlength:2000
    },
    price:{
        type:Number,
        
        required:true,
        maxlength:32
    },
    category:{
        type:mongoose.Schema.ObjectId,
        
        ref:Category,
        required:true
    },
    quantity:{type:Number},
    sold:{type:Number,default:0},
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        required:false,
        type:Boolean
    }
  
},{timestamps:true})





module.exports=mongoose.model("Product",ProductSchema)