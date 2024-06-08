
import { compare } from 'bcrypt';
import { User } from '../models/user.js'
import { sendToken } from '../utils/features.js';
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

}

export { login, newUser, getMyProfile }