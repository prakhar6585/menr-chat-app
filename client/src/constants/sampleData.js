

export const chats = [
    {
        avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
        name: "John Doe",
        _id: '1',
        groupChat: false,
        members: ['1', '2']
    },
    {
        avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
        name: "John Bonka",
        _id: '4',
        groupChat: false,
        members: ['1', '2']
    }
]
export const sampleUsers = [
    {
        avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
        name: "John Doe",
        _id: '1'
    },
    {
        avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
        name: "John Bonka",
        _id: '4'
    }
]

export const sampleNotifications = [
    {
        sender: {
            avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
            name: "John Doe",
        },
        _id: '1',
    },
    {
        sender: {
            avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
            name: "John Bonka",
        },
        _id: '4'
    }
]

export const sampleMessage = [
    {

    }
]

export const dashboardData = {
    users: [
        {
            name: 'John Doe',
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            _id: "1",
            username: "john_doe",
            friends: 20,
            groups: 5
        },
    ],
    chats: [{
        name: "Labadbass group",
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        _id: '1',
        groupChat: false,
        members: [{ _id: '1', avatar: "https://www.w3schools.com/howto/img_avatar.png" }, { _id: '2', avatar: "https://www.w3schools.com/howto/img_avatar.png" }],
        totalMembers: 2,
        totalMessages: 20,
        creator: {
            name: "John Doe",
            avatar: "https://www.w3schools.com/howto/img_avatar.png"
        }
    }],
    messages: [{
        attachments: [],
        content: "Ghante ka msg hai",
        _id: "sdafjjdfkljff",
        sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "Clorie",
        },
        chat: "chatId", groupChat: false,
        createdAt: "2024-02-12T10:41:30.630Z"
    },
    {
        attachments: [
            {
                public_id: "askdfjas 2",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            },
        ],
        content: "",
        _id: "sfkajafkljjsfklfjlksj",
        sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "Clorei 2",
        },
        chat: "chatId",
        groupChat: true,
        createdAt: "2024-02-12T10:41:30.630Z"
    }

    ]
}