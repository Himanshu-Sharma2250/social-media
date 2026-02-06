import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import db_connect from "./utils/db.js";
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js";

dotenv.config()

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
    origin: process.env.BASE_URL,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods:['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

db_connect();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/post", postRouter);

app.get("/", (req, res) => {
    res.send('Hello World again!')
})

app.listen(port, () => {
    console.log("App is listening at port ", port)
})