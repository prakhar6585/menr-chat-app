import { hash } from "bcrypt";
import mongoose, { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
}, {
    timestamps: true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) next();
    this.password = await hash(this.password, 10);
})

export const User = mongoose.models.userSchema || model("User", userSchema)