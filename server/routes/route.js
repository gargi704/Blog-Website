import express from "express";
import { signupUser, loginUser, logoutUser } from "../controller/user-controller.js";
import { uploadImage, getImage } from "../controller/image-controller.js";
import { createPost, getAllPosts, getPost, updatePost, deletePost } from "../controller/post-controller.js";
import { authenticateToken, createNewToken } from "../controller/jwt-controller.js";
import { newComment, getAllComments, deleteComment } from "../controller/comment-controller.js";
import upload from "../utils/upload.js";

const router = express.Router();

// Auth
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/logout", logoutUser);
router.post("/token", createNewToken);

// Posts
router.post("/create", authenticateToken, createPost);
router.put("/update/:id", updatePost);
router.delete("/delete/:id", authenticateToken, deletePost);
router.get("/posts", authenticateToken, getAllPosts);
router.get("/post/:id", authenticateToken, getPost);
// Files
router.post("/file/upload", upload, uploadImage);
router.get("/file/:filename", getImage);

// Comments
router.post("/comment/new", authenticateToken, newComment);
router.get("/comment/:postId", authenticateToken, getAllComments);
router.delete("/comment/delete/:id", authenticateToken, deleteComment);


export default router;
