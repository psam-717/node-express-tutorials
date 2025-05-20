import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true,
        enum : ['frontend', 'backend', 'none'],
        default: 'none'
    }
    
},{
    timestamps: true,
})

const User = mongoose.model("User", userSchema);

export default User;