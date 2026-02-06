import fs from "fs"

import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
    const userId = req.user?._id;
    const username = req.user?.name;
    const {textContent} = req.body;

    try {
        const userExist = await User.findById(userId);

        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        let imageUrl = "";

        if (req.file) {
            const imageDetail = await uploadOnCloudinary(req.file.path);

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            
            if (!imageDetail) {
                return res.status(400).json({
                    success: false,
                    message: "Error uploading to Cloudinary"
                });
            }
            imageUrl = imageDetail.secure_url;
        }

        if (!textContent && !imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Post must contain either text or an image."
            });
        }

        const post = await Post.create({
            userId: userId,
            username: username,
            textContent: textContent,
            imageUrl: imageUrl
        })

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: {
                postId: post._id,
                username: username,
                textContent: textContent,
                imageUrl: imageUrl,
                comments: post.comments,
                likes: post.likes
            }
        })
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error("Error creating post: ", error);
        res.status(500).json({
            success: false,
            message: "Error creating post"
        })
    }
};

export const getPost = async (req, res) => {
    const {postId} = req.params;

    try {
        const postExist = await Post.findById(postId);

        if (!postExist) {
            return res.status(400).json({
                success: false,
                message: "Post does not exist"
            })
        }

        res.status(200).json({
            success: true,
            message: "Post ",
            post: {
                postId: postExist.id,
                username: postExist.username,
                textContent: postExist.textContent,
                imageUrl: postExist.imageUrl,
                comments: postExist.comments,
                likes: postExist.likes
            }
        })
    } catch (error) {
        console.error("Error getting post: ", error);
        res.status(500).json({
            success: false,
            message: "Error getting post"
        })
    }
};

export const getAllPosts = async (req, res) => {
    try {
        // Fetch all posts from the database, sorted by newest first
        const posts = await Post.find().sort({ createdAt: -1 });

        const formattedPosts = posts.map(post => ({
            postId: post._id,
            username: post.username,
            textContent: post.textContent,
            imageUrl: post.imageUrl,
            comments: post.comments,
            likes: post.likes,
            createdAt: post.createdAt
        }));

        res.status(200).json({
            success: true,
            message: "All posts fetched successfully",
            posts: formattedPosts
        });
    } catch (error) {
        console.error("Error fetching all posts: ", error);
        res.status(500).json({
            success: false,
            message: "Error fetching all posts"
        });
    }
};

export const toggleLike = async (req, res) => {
    const {postId} = req.params;
    const userId = req.user._id;
    console.log("user is : ", req.user);

    try {
        const postExist = await Post.findById(postId);

        if (!postExist) {
            return res.status(400).json({
                success: false,
                message: "Post does not exist"
            })
        }

        const isLiked = postExist.likes.includes(userId);
        console.log("post is liked : ", isLiked);

        let updatedPost;

        if (isLiked) {
            // if liked then remove the user
            updatedPost = await Post.findByIdAndUpdate(postId,
                { $pull: {likes: userId} },
                { new: true }
            )
        }
        else {
            // if not liked then add the user
            updatedPost = await Post.findByIdAndUpdate(postId, 
                { $addToSet: {likes: userId} },
                { new: true }
            )
            console.log("updated post: ", updatedPost);
        }


        res.status(200).json({
            success: true,
            message: "Liked a post ",
            post: {
                postId: updatedPost.id,
                username: updatedPost.username,
                textContent: updatedPost.textContent,
                imageUrl: updatedPost.imageUrl,
                comments: updatedPost.comments,
                likes: updatedPost.likes
            }
        })
    } catch (error) {
        console.error("Error liking post: ", error);
        res.status(500).json({
            success: false,
            message: "Error liking post"
        })
    }
};

export const addComment = async (req, res) => {
    const {postId} = req.params;
    const username = req.user.name;
    const {comment} = req.body;

    if (!comment || comment.trim() === "") {
        return res.status(400).json({ 
            message: "Comment text is required" 
        });
    }

    const newComment = {
        username: username,
        text: comment,
        createdAt: new Date()
    };

    try {
        const updatedPost = await Post.findByIdAndUpdate(postId,
            { $push: { comments: newComment } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(400).json({
                success: false,
                message: "Post does not exist"
            })
        }

        res.status(200).json({
            success: true,
            message: "Commented a post ",
            post: {
                postId: updatedPost.id,
                username: updatedPost.username,
                textContent: updatedPost.textContent,
                imageUrl: updatedPost.imageUrl,
                comments: updatedPost.comments,
                likes: updatedPost.likes
            }
        })
    } catch (error) {
        console.error("Error commenting post: ", error);
        res.status(500).json({
            success: false,
            message: "Error commenting post"
        })
    }
};

export const deletePost = async (req, res) => {
    const {postId} = req.params;

    try {
        const deletePost = await Post.findByIdAndDelete(postId);

        if (!deletePost) {
            return res.status(404).json({
                success: false,
                message: "Post does not exist"
            })
        }

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting post: ", error);
        res.status(500).json({
            success: false,
            message: "Error deleting post"
        })
    }
};