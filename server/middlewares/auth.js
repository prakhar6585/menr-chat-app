import { ErrorHandler } from "../utils/utility.js";
import jwt from 'jsonwebtoken'
import { adminSecretKey } from "../app.js";

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

const isAdmin = async (req, res, next) => {
    try {

        const token = req.cookies['chat-admin-token'];

        if (!token) return next(new ErrorHandler("Only admin can access this route", 401));

        const secretKey = jwt.verify(token, process.env.JWT_SECRET);

        const isMatched = secretKey === adminSecretKey

        if (!isMatched) return nextTick(new ErrorHandler("Invalid Admin Key", 401));

        next();


    } catch (error) {
        next(error);
    }
}



export { isAuthenticated, isAdmin }