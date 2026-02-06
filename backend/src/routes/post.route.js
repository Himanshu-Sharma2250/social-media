import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, createPost, deletePost, getAllPosts, getPost, toggleLike } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const postRouter = express.Router();

postRouter.post("/create-post", verifyJWT, upload.single("image"), createPost);
postRouter.get("/get-post/:postId", verifyJWT, getPost);
postRouter.get("/get-all-posts", verifyJWT, getAllPosts);
postRouter.patch("/like/:postId", verifyJWT, toggleLike);
postRouter.patch("/comment/:postId", verifyJWT, addComment);
postRouter.delete("/delete/:postId", verifyJWT, deletePost);

export default postRouter;