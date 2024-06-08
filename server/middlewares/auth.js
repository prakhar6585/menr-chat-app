import { ErrorHandler } from "../utils/utility.js";
import jwt from 'jsonwebtoken'

const isAuthenticated = async (req, res, next) => {
    try {

        const token = req.cookies['chat'];

        if (!token) return next(new ErrorHandler("Please Login First", 401));

        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeData._id;

    } catch (error) {
        next(error);
    }
}

export { isAuthenticated }