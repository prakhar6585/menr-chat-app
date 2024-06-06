
import { User } from '../models/user.js'

// Create a new user and save it to the database and save in cookie.
const newUser = async (req, res) => {
    const avatar = {
        public_id: "dajfj",
        url: "asdfd",
    }
    await User.create({ name: "Chlory", username: "chlori", password: 'pagal', avatar });
    res.status(201).json({ message: "User Created Successfully" });
}

const login = (req, res) => {
    res.send('This is login');
}

export { login, newUser }