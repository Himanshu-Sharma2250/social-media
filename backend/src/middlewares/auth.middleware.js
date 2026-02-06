import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
    // get the token from the cookie and then verify it 
    // get the user and the assign the user to req.user
    const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized request"
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );

        const user = await User.findById(decodedToken?._id).select(
            "-password"
        );

        if (!user) {
            return res.status(400).json({
                success: true,
                message: "Invalid Access Token"
            })
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyJWT: ", error);
        res.status(500).json({
            success: false,
            message: "Invalid access token"
        })
    }
}