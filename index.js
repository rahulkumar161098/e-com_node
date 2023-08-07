const express= require('express');
const dbConnect = require('./config/dbConnect');
const authRouter= require('./routes/authRoutes');
const productRouter= require('./routes/productRoutes')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errrorHandler');
const cookieParser= require('cookie-parser')
// const slugify= require('slugify')
const morgon= require('morgan')


const app= express();
const dotenv= require('dotenv').config();   
const port= process.env.PORT || 4000
app.use(cookieParser());

// databse connections
dbConnect()
// app.use(bodyParser.json)
// app.use(bodyParser.urlencoded({extended: false}))
app.use(morgon("dev"))
app.use(express.json())

app.get('/', (req, res)=>{
    res.send("hello from server side")


});

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)

// middleware
app.use(notFound)
app.use(errorHandler)


app.listen(port,()=>{
    console.log(`this server is running on ${port}`);
})