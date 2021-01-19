const express=require("express")
const mongoose=require("mongoose")
const morgan=require("morgan")
const bodyparser=require("body-parser")
const cookieparser=require("cookie-parser")
const expressValidator=require("express-validator")
require("dotenv").config()
const { v1 , uuidv1 } =require('uuid');
const cors=require("cors")

//import Routes
const authRoutes=require("./routes/auth")
const userRoutes=require("./routes/user")
const categoryRoutes=require("./routes/category")
const ProductRoutes=require("./routes/product")

//app
const app=express();

//db
/*mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:true
}).then(()=>console.log("Database connected"))*/

const connectionurl='mongodb+srv://nithinpj333:m410We3X9BYwdqNV@cluster0.rqjpw.mongodb.net/Ecommerce?retryWrites=true&w=majority'
const PORT=process.env.PORT||8000
mongoose.connect(connectionurl,{useNewUrlParser:true,useUnifiedTopology:true})
.then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
.catch((error)=>console.log(error.message))


//morgan middilware
app.use(morgan('dev'))

app.use(bodyparser.json())
app.use(cookieparser())
app.use(expressValidator())
app.use(cors())
//routes middileware
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",ProductRoutes)


/*const PORT=process.env.PORT||8000

app.listen(PORT,()=>{
    console.log(`server is running on the port of ${PORT}`)
})*/