import mongoose, {Schema} from "mongoose";

const postSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        username: {
            type: String,
            required: true
        },
        textContent: {
            type: String,
            required: function() { return !this.imageUrl; }
        },
        imageUrl: {
            type: String,
            required: function() { return !this.textContent; }
        },
        likes: [{
            type: String
        }],
        comments: [{
            username: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }]
    },
    {timestamps: true}
)

export const Post = mongoose.model("Post", postSchema);