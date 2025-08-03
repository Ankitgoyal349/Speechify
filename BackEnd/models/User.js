import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z\s]+$/, // Regex for validating username (only letters and spaces)
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // Regex for validating email
    },
    
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

export default User;
