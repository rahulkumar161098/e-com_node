const User= require('../models/userModel')
const jwt= require('jsonwebtoken')
const asyncHandler= require('express-async-handler')

const authmiddleware= asyncHandler(
    async(req, res, next)=>{
        let token;
        if(req?.headers?.authorization?.startsWith("Bearer")){
            token= req.headers.authorization.split(" ")[1];
            try{
                if(token){
                    const decode= jwt.verify(token, process.env.JWT)
                    // console.log(decode);
                    let user= await User.findById(decode?.id);
                    
                    req.user= user;
                    // console.log(user);
                    next()
                }
            }
            catch(error){
                throw new Error("Not authorized token expaired, Please login!")
            }
        }else{
            throw new Error("There is no token attached to header")
        }
    }
)

// IsAdmin
const isAdmin= asyncHandler(
    async(req, res, next)=>{
        const {email}= await (req.user)
        // console.log(email);
        const adminUser= await User.findOne({email})
        // console.log(adminUser);
        if(adminUser.role === 'admin'){
            next()
        }
        else{
            throw new Error("You are not a Admin")
        }
    }
)


module.exports={authmiddleware, isAdmin}