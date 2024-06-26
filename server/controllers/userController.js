
import { compare } from 'bcrypt';
import { User } from '../models/user.js'
import { cookieOptions, emitEvent, sendToken } from '../utils/features.js';
import { ErrorHandler } from '../utils/utility.js';
import { Request } from '../models/request.js'
import { REFETCH_CHAT } from '../constants/events.js';
import { Chat } from '../models/chat.js';
import { getOtherMembers } from '../lib/helper.js';

// Create a new user and save it to the database and save in cookie.
const newUser = async (req, res) => {
    const { name, username, password, bio } = req.body;
    const file = req.file;

    if (!file) return next(new ErrorHandler("Please upload avatar"))

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

const searchUser = async (req, res) => {
    try {
        const { name = '' } = req.query;

        // finding all of my chats
        const myChats = await User.find({ groupChat: false, members: req.user });

        // all users from my chats or friends
        const allUsersFromChat = myChats.map((chat) => chat.members).flat();

        const allUsersExceptMeAndFriends = await User.find({
            _id: { $nin: allUsersFromChat },
            name: { $regex: name, $options: "i" }
        })

        const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) =>
            ({ _id, name, avatar: avatar.url }))

        return res.status(200).json({
            success: true,
            users
        })

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "name"
        })
    }
}

const sendFriendRequest = async (req, res, next) => {
    try {
        const { userId } = req.body;

        const request = await Request.findOne({
            $or: [
                { sender: req.user, receiver: userId },
                { sender: userId, receiver: req.user }
            ]
        })

        if (request) return next(new ErrorHandler("Request ALready sent", 400));

        await Request.create({
            sender: req.user,
            receiver: userId
        })

        emitEvent(req, NEW_REQUEST, [userId]);
        res.status(200).json({
            success: true,
            message: "Friend Request Sent"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error in send friend request"
        })
    }
}

const acceptFriendRequest = async (req, res, next) => {
    try {
        const { requestId, accept } = req.body;

        const request = await Request.findById(requestId).populate("sender", 'name').populate('receiver', 'name');

        if (!request) return next(new ErrorHandler("Request not found", 404));

        if (request.receiver._id.toString() !== req.user.toString()) return next(new ErrorHandler("Unauthorized", 401));

        if (!accept) {
            await request.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Friend request Rejected"
            });
        }

        const members = [request.sender._id, request.receiver._id];

        await Promise.all([
            Chat.create({
                members,
                name: `${request.sender.name} and ${request.receiver.name}`,
            }),
            request.deleteOne(),
        ])

        emitEvent(req, REFETCH_CHAT, members);

        return res.status(200).json({
            success: true,
            message: "Friend Request Accepted",
            senderId: request.sender._id,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error in accept friend request"
        })
    }
}

const getNotifications = async (req, res, next) => {
    try {
        const request = await Request.find({ receiver: req.user }).populate("sender", "name avatar");

        const allRequests = requests.map(({ _id, sender }) => ({
            _id,
            sender: {
                _id: sender._id,
                name: sender.name,
                avatar: sender.avatar.url,
            }
        }))
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error in get notifications"
        })
    }
}

const getMyFriends = async (req, res, next) => {
    try {
        const { chatId } = req.query.chatId;

        const chats = await Chat.find({
            members: req.user,
            groupChat: false,
        }).populate("members", "name avatar");

        const friends = chats.map(({ members }) => {
            const otherUser = getOtherMembers(members, req.user);

            return {
                _id: otherUser._id,
                name: otherUser.name,
                avatar: otherUser.avatar.url,
            }
        });

        if (chatId) {
            const chat = await Chat.findById(chatId);
            const availableFriends = friends.filter(
                (friend) => !chat.members.includes(friend._id)
            );
            return res.status(200).json({
                success: true,
                friends: availableFriends,
            })
        } else {
            return res.status(200).json({
                success: true,
                friends
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error in accept friend request"
        })
    }
}

export { login, newUser, getMyProfile, logout, searchUser, sendFriendRequest, acceptFriendRequest, getNotifications, getMyFriends }