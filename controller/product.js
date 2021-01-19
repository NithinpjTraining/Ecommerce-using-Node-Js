const formidable=require("formidable")
const _=require("lodash")
const fs=require("fs")
const Product=require("../model/product")
const {errorHandler}=require("../helpers/dbErrorhandler")

exports.productById=(req,res,next,id)=>{
Product.findById(id).exec((err,pro)=>{
if(err||!pro)
{
    return res.status(400).json({message:"Product not found"})  
}
req.product=pro;
next()
})
}

exports.read=(req,res)=>{
    req.product.photo=undefined
    return res.json(req.product)
}


exports.create=(req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
         
        if(err)
        {
            return res.status(400).json({message:"Image could not be uploaded"})
        }

        //check for all 
        const {name,description,price,category,quantity,shipping}=fields
        if(!name||!description||!price||!category||!quantity||!shipping)
        {
            return res.status(400).json({message:"All fields are required"})
        }

        let product=new Product(fields)

        if(files.photo)
        {
            //1kb=1000
           // 1mb=1000000
           if(files.photo.size>1000000)
           {
            return res.status(400).json({message:"image should be lessthan 1mb"})  
           }
            product.photo.data=fs.readFileSync(files.photo.path)
            product.photo.contentType=files.photo.type
        }

        product.save((err,result)=>{

            if(err)
            {
                return res.status(400).json({message:errorHandler})
            }
            res.json(result)

        })
    })
    
}


exports.remove=(req,res)=>{
    let product=req.product
    product.remove((err,deletedProduct)=>{
        if(err)
        {
            return res.status(400).json({message:errorHandler})  
        }
        res.json("product deleted successfully")
    })
}


exports.update=(req,res)=>{
    let form = new formidable.IncomingForm()
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
         
        if(err)
        {
            return res.status(400).json({message:"Image could not be uploaded"})
        }

        //check for all 
        const {name,description,price,category,quantity,shipping}=fields
        if(!name||!description||!price||!category||!quantity||!shipping)
        {
            return res.status(400).json({message:"All fields are required"})
        }

        let product=req.product
        product = _.extend(product,fields)

        if(files.photo)
        {
            //1kb=1000
           // 1mb=1000000
           if(files.photo.size>1000000)
           {
            return res.status(400).json({message:"image should be lessthan 1mb"})  
           }
            product.photo.data=fs.readFileSync(files.photo.path)
            product.photo.contentType=files.photo.type
        }

        product.save((err,result)=>{

            if(err)
            {
                return res.status(400).json({message:errorHandler})
            }
            res.json(result)

        })
    })
    
}

/*
sell/arrival
//return the product by sell=/products?sortBy=sold&order=desc&limit=4
//return the product by arrival=/products?sortBy=createdAt&order=desc&limit=4
//if no params are send then return all product
*/

exports.list=(req,res)=>{
    let order=req.query.order ? req.query.order : 'asc'
    let sortBy=req.query.sortBy ? req.query.sortBy : '_id'
    let limit=req.query.limit ? parseInt( req.query.limit ): 2
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,products)=>{
if(err)
{
 res.status(400).json({message:"product not found"})   
}
res.json(products)
    })
}
//it will find the product based on the req product category
//product has the same category it will return
exports.ListRelated=(req,res)=>{

    let limit=req.query.limit ? parseInt( req.query.limit ): 5
Product.find({_id:{$ne:req.product},category:req.product.category})
.limit(limit)
.populate("category",'_id name')
.exec((err,result)=>{
    if(err)
    {
        res.status(400).json({message:"product not found"})     
    }
    res.json(result)


})

}

exports.ListCategories=(req,res)=>{
 Product.distinct("category",{},(err,cat)=>{
     if(err)
     {
        res.status(400).json({message:"category not found"})  
     }
     res.json(cat)
 })   

}


/**
 * list products by search

 */




exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if(err)
            {
               res.status(400).json({message:"products not found"})  
            }
            res.json({
                size: data.length,
                data
            });
        });
};


exports.photo=(req,res,next)=>{

    if(req.product.photo.data)
    {
        res.set('content-Type',req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
next()
}