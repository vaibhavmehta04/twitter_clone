import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { generateTokenAndSetCookie } from "../lib/utils/generateTokens.js";

export const signup = async (req,res)=>{
    console.log("Received body:", req.body);
    try {
        const {fullname,username, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email address"});
        }

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message:"Username already exists"});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message:"Email already exists"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        } 
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
        });
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            // Send response to client
            res.status(201).json({
                
                
                    _id:newUser._id,
                    fullname:newUser.fullname,
                    username:newUser.username,
                    email:newUser.email,
                    followers:newUser.followers,
                    following:newUser.following,
                    profileImg:newUser.profileImg,
                    coverImg:newUser.coverImg,
                
            });

        }else{
            res.status(400).json({message:"User not created"});

        }


    }catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const login= async (req,res)=>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect =  await bcrypt.compare(password, user?.password||"");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            email:user.email,
            followers:user.followers,
            following:user.following,
            profileImg:user.profileImg,
            coverImg:user.coverImg,
        });

    }catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"});
    }

}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "Lax", // use "None" if cross-site and using HTTPS
            secure: process.env.NODE_ENV === "production", // must match cookie settings from login
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getMe = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    };
};