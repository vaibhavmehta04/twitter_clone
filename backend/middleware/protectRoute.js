import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
 export const protectRoute = async (req, res, next) => {
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized"});
        }
        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message:"user not found"});
        }
        req.user=user;
        next();
    }catch(error){
        console.log("error in protectRoute middleware",error);
        res.status(500).json({message:"Internal server error"});
    }
 }