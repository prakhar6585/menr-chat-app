import { Chat } from "../models/chat.js"
import { User } from "../models/user.js"
import { Message } from '../models/message.js'
import { ErrorHandler } from "../utils/utility.js";
import jwt from 'jsonwebtoken';
import { cookieOptions } from '../utils/features.js'

const adminLogin = async (req, res) => {
    try {
        const { secretKey } = req.body;

        const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'mernChatApp'

        const isMatched = secretKey === adminSecretKey

        if (!isMatched) return nextTick(new ErrorHandler("Invalid Admin Key", 401));

        const token = jwt.sign(secretKey, process.env.JWT_SECRET);
        return res.status(200).cookie("chat-admin-token", token, { ...cookieOptions, maxAge: 1000 * 60 * 15 })
            .json({
                success: true,
                message: "Authenticated Successfully",
            })
    } catch (error) {

    }
}

const adminLogout = async (req, res) => {
    try {
        return res.status(200).cookie("chat-admin-token", "", { ...cookieOptions, maxAge: 1000 * 60 * 15 })
            .json({
                success: true,
                message: "Logout Successfully",
            })
    } catch (error) {

    }
}

const allUsers = async (req, res) => {
    try {
        const allUsers = await User.find({})

        const transformedUsers = await Promise.all(
            allUsers.map(({ name, username, avatar, _id }) => {
                const [groups, friends] = Promise.all([
                    Chat.countDocuments({ groupChat: true, members: _id }),
                    Chat.countDocuments({ groupChat: false, members: _id }),
                ]);

                return {
                    name,
                    username,
                    avatar: avatar.url,
                    _id,
                    groups,
                    friends,
                }
            })
        )

        return res.status(200).json({
            status: "success",
            allUsers: transformedUsers,
        })
    } catch (error) {

    }
}

const allChats = async (req, res) => {
    try {
        const chats = (await Chat.find({}))
            .populate('members', 'name avatar')
            .populate('creator', 'name avatar');

        const transformedChat = await Promise.all(chats.maap(async ({ members, _id, groupChat, name, creator }) => {

            const totalMessages = await MessageChannel.countDocuments({ chat: _id });
            return {
                _id,
                groupChat,
                name,
                avatar: members.slice(0, 3).map((member) => member.avatar.url),
                memberss: members.map(({ _id, name, avatar }) => (
                    {
                        _id,
                        name,
                        avatar: avatar.url
                    }
                )),
                creator: {
                    name: creator?.name || "None",
                    avatar: creator?.avatar.url || "",
                },
                totalMembers: members.length,
                totalMessages,
            }
        }));

        return res.status(200).json({
            status: 'success',
            chats: transformedChat
        })
    } catch (error) {

    }
}

const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({})
            .populate("sender", 'name avatar')
            .populate("chat", "groupChat")

        const transfromMessages = messages.map(({ content, attachments, _id, sender, createdAt, chat }) => ({
            _id, attachments, content, createdAt, chat: chat._id, groupChat: chat.groupChat, sender: { _id: sender._id, name: sender.name, avatar: sender.avatar.url }
        }))

        res.status(200).json({
            success: true,
            transfromMessages,
        })


    } catch (error) {

    }
}

const getDashboard = async (req, res) => {
    try {
        const [groupsCount, usersCount, messagesCount, totalChatsCount] = await Promise.all([
            Chat.countDocuments({ groupChat: true }),
            User.countDocuments(),
            Message.countDocuments(),
            Chat.countDocuments(),
        ])

        const today = new Date();
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const last7DaysMessages = await Message.find({
            createdAt: {
                $gte: last7Days,
                $lte: today,
            },
        }).select('createdAt');

        const messages = new Array(7).fill(0);

        last7DaysMessages.forEach(message => {
            const indexApprox = (today.getTime() - message.createdAt.getTime()) / (1000 * 60 * 60 * 24);
            const index = Math.floor(indexApprox)
            messages[6 - index]++;
        })

        const stats = {
            groupsCount,
            usersCount,
            messagesCount,
            totalChatsCount,
            messagesChart: messages
        }

        res.status(200).json({
            success: true,
            stats,
        })
    } catch (error) {

    }
}

export { allUsers, allChats, allMessages, getDashboard, adminLogin, adminLogout }