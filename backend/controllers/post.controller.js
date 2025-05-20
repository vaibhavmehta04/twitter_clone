import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId= req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!text && !img) {
            return res.status(400).json({ message: "Please provide text or image" });
        }
        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text, 
            img,
        });
        await newPost.save(); 
        res.status(201).json(newPost); 


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
        
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }
        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
        
    }
};

export const commentPost = async (req, res) => {
    try {
        const {text} =req.body;
        const postId=req.params.id;
        const userId=req.user._id;

        if(!text) {
            return res.status(400).json({ message: "Please provide text" });
        }
        const post =await Post.findById(postId);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }

        const comment ={
            user:userId,
            text,
        }
        post.comments.push(comment);
        await post.save();
        res.status(201).json(post);

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
        
    }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const {id:postId}=req.params;
        const userId=req.user._id;
        if(!userId){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({ message: "Post not found" });
        }
         const isliked= post.likes.includes(userId);
        if(isliked){
            await Post.updateOne(
                { _id: postId },
                { $pull: { likes: userId } },
            );
            await User.updateOne(
                { _id: userId },
                { $pull: { likedPosts: postId } },
            );

             return res.status(200).json({ message: "Post unliked" });
           
        }else{
            post.likes.push(userId);
            await User.updateOne(
                { _id: userId },
                { $push: { likedPosts: postId } },
            );
            await post.save();
        }

        
        
        const newNotification = new Notification({
            from: userId,
            to: post.user,
            type: "like",
        });
        await newNotification.save();
        res.status(200).json({ message: "Post liked" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
        
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts=await Post.find().sort({createdAt:-1}).populate("user", "-password").populate("comments.user", "-password").populate("likes","-password").exec();

        if(posts.length===0){
            return res.status(404).json([]);
        }
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getLikedPosts = async (req, res) => {
    const userId = req.user._id;
    try {
        const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const likedPosts=await Post.find({ _id: { $in: user.likedPosts } }).populate("user", "-password").populate("comments.user", "-password");
        res.status(200).json(likedPosts);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



export const getPostsByUsername = async (req, res) => {
	try {
		const { username } = req.params;

		// Find user by username
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Find posts where 'user' field matches user's _id
		const posts = await Post.find({ user: user._id })
			.populate("user", "-password")           // populate user info, exclude password
			.populate("comments.user", "-password")  // populate each comment's user info, exclude password
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error("getPostsByUsername error:", error.message);
		res.status(500).json({ error: "Server error" });
	}
};
