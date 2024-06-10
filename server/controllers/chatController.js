import { ErrorHandler } from "../utils/utility.js";
import { Chat } from '../models/chat.js'
import { emitEvent } from "../utils/features.js";
import { ALERT, REFETCH_CHAT } from "../constants/events.js";

const newGroupChat = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        if (members.length < 2) {
            return next(new ErrorHandler("Group chat must have at least 3 members", 400))
        }
        const allMembers = [...members, req.user];
        await Chat.create({
            name,
            groupChat: true,
            creator: req.user,
            members: allMembers,
        })
        emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
        emitEvent(req, REFETCH_CHAT, members);

        return res.status(201).json({
            success: true,
            message: "Group Created",
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in new group chat"
        })
    }
}

export { newGroupChat }