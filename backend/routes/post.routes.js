import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {getLikedPosts,getAllPosts, likeUnlikePost,commentPost,deletePost,createPost,getPostsByUsername } from "../controllers/post.controller.js";
const router = express.Router();


router.get("/all",protectRoute,getAllPosts)
router.get("/likes/:id",protectRoute,getLikedPosts)
router.post("/create",protectRoute,createPost)
router.delete("/:id",protectRoute,deletePost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment/:id",protectRoute,commentPost)
router.get("/user/:username", protectRoute, getPostsByUsername); 

export default router;
