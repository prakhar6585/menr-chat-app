import { ErrorHandler } from "../utils/utility.js";
import { Chat } from '../models/chat.js'
import { Message } from '../models/message.js'
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import { ALERT, NEW_ATTACHMENT, NEW_ATTACHMENT_ALERT, REFETCH_CHAT } from "../constants/events.js";
import { getOtherMembers } from "../lib/helper.js";

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

const getMyChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({ members: req.user }).populate("members", "name avatar");

        const transformedChats = chats.map(chat => {
            const otherMember = getOtherMembers(members, req.user)
            return {
                _id,
                groupChat,
                avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [otherMember.avatar.url],
                name: groupChat ? name : otherMember.name,
                members: members.reduce((prev, curr) => {
                    if (curr._id.toString() !== req.user.toString()) {
                        prev.push(curr, _id);
                    }
                    return prev;
                }, []),
            };
        });

        return res.status(200).json({
            success: true,
            chats: transformedChats
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in new group chat"
        })
    }
}

const getMyGroups = async (req, res, next) => {
    try {
        const chats = await Chat.find({
            members: req.user,
            groupChat: true,
            creator: req.user,
        }).populate('members', 'name avatar')

        const groups = chats.map(({ members, _id, groupChat, name }) => ({
            _id,
            groupChat,
            name,
            avatar: members.slice(0, 3).map((avatar) = avatar.url),
        }))

        return res.status(200).json({
            success: true,
            groups,
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in get my group"
        })
    }
}

const addMembers = async (req, res, next) => {
    try {
        const { chatId, members } = req.body;

        if (!member || members.length < 1) { return next(new ErrorHandler("Please provide members", 400)) }

        const chat = await Chat.findByIdD(chatId);
        if (!chat) { return next(new ErrorHandler("Chat not found", 404)) };
        if (!groupChat) { return next(new ErrorHandler("It is not a group chat", 404)) };

        if (chat.creator.toString() !== req.user.toString()) { return next(new ErrorHandler("You are not allowed to add members", 403)) }

        const allNewMembersPromise = members.map(i => UserActivation.findByIdD(i, 'name'));

        const allNewMembers = await Promise.all(allNewMembersPromise);

        const uniqueMembers = allNewMembers.filter((i) => !chat.members.includes(i._id.toString())).map((i) => i._id);

        chat.members.push(...uniqueMembers);

        if (chat.members.length > 100) { return next(new ErrorHandler("Group members limits exceeded", 400)) };

        await chat.save();

        const allUserName = allNewMembers.map(i => i.name).join("");

        emitEvent(
            req,
            ALERT,
            chat.members,
            `${allUserName} has been added to group`
        );

        emitEvent(req, REFETCH_CHAT, chat.members);

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in add members"
        })
    }
}

const removeMembers = async (req, res, next) => {
    try {

        const { userId, chatId } = req.body;

        const [chat, userToBeRemove] = await Promise.all([
            Chat.findById(chatId),
            User.findById(userId, 'name'),
        ])

        if (!chat) { return next(new ErrorHandler("Chat not found", 404)) };

        if (!chat.groupChat) { return next(new ErrorHandler("This is not a group chat", 400)) };

        if (chat.creator.toString() !== req.user.toString()) { return next(new ErrorHandler("You are not allowed to add members", 403)) }

        if (chat.members.length <= 3) { return next(new ErrorHandler("Group must have at least 3 members", 400)) };

        chat.members = chat.members.filter((member) => member.toString() !== userId.toString());

        await chat.save();
        emitEvent(req, ALERT, chat.members, `${userToBeRemove.name} has been removed from the group`)
        emitEvent(req, REFETCH_CHAT, chat.members);

        return res.status(200).json({
            success: true,
            message: "Member removed successfully",
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in remove members"
        })
    }
}

const leaveGroup = async (req, res, next) => {
    try {
        const chatId = req.params.id;

        const chat = await Chat.findById(chatId);

        if (!chat) { return next(new ErrorHandler("chat not found", 404)) };

        const remainingMembers = chat.members.filter((member) => member.toString() !== req.user.toString())

        if (chat.creator.toString() === req.user.toString()) {
            const random = Math.floor(random() * remainingMembers.length);
            const newCreator = remainingMembers[random];
            chat.creator = newCreator
        }

        chat.members = remainingMembers;

        const [user] = await Promise.all([User.findById(req.user, "name"), chat.save()])

        emitEvent(req, ALERT, chat.members, `${user.name} has left the group`)

        emitEvent(req, REFETCH_CHAT, chat.members);

        return res.status(200).json({
            success: true,
            message: "Member left successfully",
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error in Leave Group"
        })
    }
}

const sendAttachments = async (req, res, next) => {
    try {
        const { chatId } = req.body;

        const files = req.files || [];

        if (files.length < 1) return next(new ErrorHandler("Please Upload attachments", 400))

        if (files.length > 5) return next(new ErrorHandler("Files can't be more than 5", 400))

        const [chat, me] = await Promise.all([Chat.findById(chatId), User.findById(req.user, 'name')]);

        if (!chat) { return next(new ErrorHandler("Chat not found", 404)) };

        // upload files here
        const attachmeents = [];

        const messageForRealTime = {
            ...messageForDB,
            sender: {
                _id: me._id, name: me.name,
            },
        };

        const messageForDB = { content: "", attachmeents, sender: me._id, chatId };

        const message = await Message.create(messageForDB);

        emitEvent(req, NEW_ATTACHMENT, chat.members, {
            message: messageForRealTime,
            chatId
        })

        emitEvent(req, NEW_ATTACHMENT_ALERT, chat.members, { chatId })

        return res.status(200).json({
            success: true,
            message: "Attachments sent successfully"
        })
    } catch (error) {

    }
}

const getChatDetails = async (req, res, next) => {
    try {
        if (req.query.populate === 'true') {
            const chat = await Chat.findById(req.params.id).populate("members", 'name avatar').lean();
            if (!chat) return next(new ErrorHandler("Chat not found", 400));

            chat.members = chat.members.map(({ _id, name, avatar }) => ({
                _id,
                name,
                avatar: avatar.url,
            }))

            return res.status(200).json({
                success: true,
                chat,
            })
        } else {
            const chat = await Chat.findById(req.params.id);
            if (!chat) return next(new ErrorHandler("Chat not found", 400));
            return res.status(200).json({
                success: true,
                chat,
            })
        }
    } catch (error) {

    }
}

const renameGroup = async (req, res, next) => {
    try {
        const chatId = req.params.id;

        const { name } = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) return next(new ErrorHandler("Chat not found", 404));

        if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400))

        if (chat.creator.toString() !== req.user.toString()) {
            return next(new ErrorHandler("you are not allowed to reaname the group", 403));
        }
        chat.name = name;
        await chat.save();
        emitEvent(req, REFETCH_CHAT, chat.members)

        return res.status(200).json({
            success: true,
            message: "Group rename successfully"
        })
    } catch (error) {

    }
}

const deleteChat = async (req, res, next) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findById(chatId);

        if (!chat) return next(new ErrorHandler("Chat not found", 404));

        const members = chat.members;
        if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
            return next(new ErrorHandler("you are not allowed to reaname the group", 403));
        }

        // Here we haave to delete all messages as well as attachmetns and files from cloudinary
        const messagesWithAttachments = await Message.find({
            chat: chatId,
            attachments: { $exists: true, $ne: [] },
        })
        const public_ids = [];
        messagesWithAttachments.forEach(async ({ attachmeents }) => {
            attachmeents.forEach(({ public_id }) => {
                public_ids.push(public_id)
            });

            await Promise.all([
                // delete files from cloudinary 
                deleteFilesFromCloudinary(public_ids), chat.deleteOne(), Message.deleteMany({ chat: chatId })
            ])

            emitEvent(req, REFETCH_CHAT, members);
            return res.status(200).json({
                success: true,
                message: "Chat delete successfully"
            })
        })
    } catch (error) {

    }
}

const getMessages = async (req, res, next) => {
    try {
        const chatId = req.params.id;
        const { page = 1 } = req.query;
        const resultPerPage = 20;
        const skip = (page - 1) * limit

        const [messages, totalMessagesCount] = await Promise.all([
            Message.find({ chat: chatId }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("sender", "name").lean(), Message.countDocuments({ chat: chatId })
        ])
        const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

        return res.status(200).json({
            success: true,
            message: messages.reverse(),
            totalPages
        })
    } catch (error) {

    }
}

export { newGroupChat, getMyChats, getMyGroups, addMembers, removeMembers, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages }