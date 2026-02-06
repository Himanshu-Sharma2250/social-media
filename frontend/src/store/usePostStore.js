import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast"

export const usePostStore = create((set) => ({
    posts: [],
    likes: [],
    comments: [],
    isCreatingPost: false,
    isGettingPosts: false,
    isAddingComment: false,
    isDeletingPost: false,

    createPost: async (data) => {
        set({ isCreatingPost: true });
        try {
            const res = await axiosInstance.post("/post/create-post", data);
            const newPost = res.data.post;

            set((state) => ({
                posts: [newPost, ...state.posts]
            }));
            return true;
        } catch (error) {
            return false;
        } finally {
            set({ isCreatingPost: false });
        }
    },

    getPost: async (postId) => {
        set({isGettingPosts: true});

        try {
            const res = await axiosInstance.get(`/post/get-post/${postId}`);
            const data = res.data;

            return data;
        } catch (error) {
            console.error("Error getting post", error);
            toast.error("Error getting post")            
        } finally {
            set({isGettingPosts: false});
        }
    },

    getAllPosts: async () => {
        set({isGettingPosts: true});

        try {
            const res = await axiosInstance.get(`/post/get-all-posts`);
            const data = res.data;
            console.log("all posts: ", res.data.posts);

            set({posts: data.posts});
            return true;
        } catch (error) {
            console.error("Error getting posts", error);
            
            return error;
        } finally {
            set({isGettingPosts: false});
        }
    },

    toggleLike: async (postId) => {
        try {
            const res = await axiosInstance.patch(`/post/like/${postId}`);
            const updatedPost = res.data.post;

            set((state) => ({
                posts: state.posts.map((p) => (p.postId === postId ? updatedPost : p))
            }));
        } catch (error) {
            toast.error("Error liking post");
        }
    },

    addComment: async (postId, commentData) => {
        set({ isAddingComment: true });
        try {
            const res = await axiosInstance.patch(`/post/comment/${postId}`, commentData);
            const updatedPost = res.data.post;

            set((state) => ({
                posts: state.posts.map((p) => (p.postId === postId ? updatedPost : p))
            }));
        } catch (error) {
            toast.error("Error adding comment");
        } finally {
            set({ isAddingComment: false });
        }
    },

    deletePost: async (postId) => {
        set({isDeletingPost: true});

        try {
            const res = await axiosInstance.delete(`/post/delete/${postId}`);

            const updatedPost = posts.map((post) => post.postId !== postId);
            set({posts: updatedPost})
        } catch (error) {
            console.error("Error deleting post", error);
            toast.error("Error deleting post")            
        } finally {
            set({isDeletingPost: false});
        }
    },
}))