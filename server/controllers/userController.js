
import { User } from '../models/user.js'
import { sendToken } from '../utils/features.js';

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

const login = (req, res) => {
    res.send('This is login');
}

export { login, newUser }