import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        }
    }, 
    { timestamps: true }
);

userSchema.pre("save", async function () {
    // mongoose v9.0.0 donot use next , instead it automatically does the work
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 1000 * 60 * 60 }
    );
};

export const User = mongoose.model("User", userSchema);