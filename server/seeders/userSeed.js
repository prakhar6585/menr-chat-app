import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { faker } from '@faker-js/faker'

const createUser = async (numUsers) => {
    try {
        const usersPromise = [];

        for (let i = 0; i < numUsers; i++) {
            const tempUser = User.create({
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                bio: faker.lorem.sentence(10),
                password: "password",
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName()
                }
            })
            usersPromise.push(tempUser);
            await Promise.all(usersPromise)
            console.log("users created", numUsers);
            process.exit(1);
        }
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

const createSingleChats = async (numChats) => {
    try {
        const users = await User.find().select("_id");
        const chatsPromise = [];

        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                chatsPromise.push(
                    Chat.create({
                        name: faker.lorem.words(2),
                        members: [users[i], users[j]],
                    })
                )
            }
        }
        await Promise.all(chatsPromise);
        console.log("Chats created successsfully");
        process.exit();
    } catch (error) {
        process.exit(1);
    }


}

const createGroupChats = async () => {

}

export { createUser, createSingleChats, createGroupChats }