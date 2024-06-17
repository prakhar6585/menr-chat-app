import { Chat } from "../models/chat.js"
import { User } from "../models/user.js"

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

    } catch (error) {

    }
}

export { allUsers, allChats }