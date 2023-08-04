const { default: mongoose, model } = require("mongoose")

const dbConnect=()=>{
    try{
        // mongoose.connect('mongodb://127.0.0.1:27017/myapp');
        const conn= mongoose.connect(process.env.DATABASE_URL);
        console.log("database connected successfully");
    }
    catch(error){
        // throw new Error(error);
        console.log("Database error");
    }
}
module.exports= dbConnect;