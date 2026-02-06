import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})

const db_connect = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('database connection establish')
        })
        .catch((error) => {
            console.log("database connected failed")
            console.log(error)
            process.exit(1)
        })
}

export default db_connect;