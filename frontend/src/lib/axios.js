import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://social-media-backend-rkly.onrender.com/api/v1/",
    withCredentials:true,
});