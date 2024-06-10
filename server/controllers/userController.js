
import { compare } from 'bcrypt';
import { User } from '../models/user.js'
import { cookieOptions, sendToken } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';

// Create a new user and save it to the database and save in cookie.
const newUser = async (req, res) => {
    const { name, username, password, bio } = req.body;

    const avatar = {
        public_id: "dajfj",
        url: "asdfd",
    }
    const user = await User.create({
        name, bio, username, password, avatar
    });
    sendToken(res, user, 201, "User Created");
    res.status(201).json({ message: "User Created Successfully" });
}

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).select("+password");

        if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

        const isMatch = await compare(password, user.password);

        if (!isMatch) return next(new ErrorHandler("Invalid Credentials", 404));

        sendToken(res, user, 200, `Welcome Back , ${user.name}`);
    } catch (error) {
        next(error);
    }

}

const getMyProfile = async (req, res) => {

    const user = await User.findById(req.user).select('-password');
    res.status(200).json({
        success: true,
        user,
    })
}

const logout = (req, res) => {
    try {
        return res.status(200).cookie('chat', "", { ...cookieOptions, maxAge: 0 }).json({
            success: true,
            message: "Logout Successfully",
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Error in logout"
        })
    }
}

const searchUser = (req, res) => {
    try {
        const { name } = req.query;


    } catch (error) {
        res.status(401).json({
            success: false,
            message: "name"
        })
    }
}

export { login, newUser, getMyProfile, logout, searchUser }