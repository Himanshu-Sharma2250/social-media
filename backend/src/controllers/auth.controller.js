import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

import { loginUserSchema, registerUserSchema } from "../validators/auth.validator.js"
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

export const registerUser = async (req, res) => {
    const {data, error} = registerUserSchema.safeParse(req.body);

    if (error) {
        console.error("Error in safeParse : ", error);
        return res.status(400).json({
            success: false,
            message: "Error in safeParse of zod"
        })
    }

    const {name, email, password} = data;

    try {
        // find if the user already exist or not 
        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered"
            })
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: "User registered",
            user: {
                userId: user._id,
                username: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Error registering user: ", error);
        res.status(500).json({
            success: false,
            message: "Error registering User"
        })   
    }
}

export const loginUser = async (req, res) => {
    const {data, error} = loginUserSchema.safeParse(req.body);

    if (error) {
        console.error("Error in safeParse: ", error);
        return res.status(400).json({
            success: false,
            message: "Error in safeParse of zod"
        })
    }

    const {email, password} = data;

    try {
        // get the user using email and check if the user is present
        // then compare the passwords with hashed password stored in the db
        // if true then create a token using jwt which will be store in the cookie
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email or Password is Incorrect"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Email or Password is Incorrect"
            })
        }

        const accessToken = user.generateAccessToken();

        const cookieOption = {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: process.env.NODE_ENV === "production",
            sameSite: none
        }

        res.status(200)
            .cookie("AccessToken", accessToken, cookieOption)
            .json({
                success: true,
                message: "User logged in successfully", 
                user: {
                    userId: user._id,
                    username: user.name,
                    email: user.email
                }
            })
    } catch (error) {
        console.error("Error in loginUser: ", error);
        res.status(500).json({
            success: false,
            message: "Error in Login User"
        })
    }
};

export const logoutUser = async (req, res) => {
    // just clear the tokens stored in the cookie
    try {
        await User.findById(
            req.user?._id
        )

        const cookieOption = {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: process.env.NODE_ENV === "production"
        }

        res.status(200)
            .clearCookie("AccessToken", cookieOption)
            .json({
                success: true,
                message: "User logged out successfully", 
            })
    } catch (error) {
        console.error("Error in logging out User: ", error);
        res.status(500).json({
            success: false,
            message: "Error in logging out User"
        })
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please Login"
            })
        }

        res.status(200).json({
            success: true,
            message: "User's Profile",
            user: {
                userId: user._id,
                username: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Error getting User's Profile: ", error);
        res.status(500).json({
            success: false,
            message: "Error getting User's Profile"
        })
    }
}