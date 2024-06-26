import express from 'express'
import userRoute from './routes/userRoute.js'
import chatsRoute from './routes/chatsRoute.js'
import { connectDB } from './utils/features.js';
import dotenv from "dotenv";
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser'
import adminRoute from './routes/adminRoute.js'
import { Server } from 'socket.io'
import { createServer } from 'http';
import { NEW_MESSAGE } from './constants/events.js';
import { getSockets } from './lib/helper.js';
import { Message } from './models/message.js';
import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'


dotenv.config({
    path: './.env'
})

connectDB(process.env.MONGO_URI)

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
const server = createServer(app);
const io = new Server(server, {});

export const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'asf=fakfhhasfhlfjjjfajf'
export const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
export const userSocketId = new Map();

//using middleware here
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL],
    credentials: true,
}))


app.use('/api/v1/user', userRoute)
app.use('/api/v1/chat', chatsRoute)
app.use('/api/v1/admin', adminRoute)

app.get('/', (req, res) => {
    res.status(200).send('This is default page')
})

io.use((socket, next) => {

})

io.on("connection", (socket) => {
    const user = {
        _id: "ajfjf;",
        name: "dfjdajsdjfdssjf"
    };
    userSocketId.set(user._id.toString(), socket.id)
    console.log("New connection established", socket.id);

    socket.on(NEW_MESSAGE, async ({ chatId, members, messages }) => {

        const messageForRealTime = {
            content: messages,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name
            },
            chatId,
            createdAt: new Date().toISOString(),
        }

        const messageForDB = {
            content: messages,
            sender: user._id,
            chat: chatId,
        };

        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime,
        })
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });
        try {
            await Message.create(messageForDB);
        } catch (error) {
            console.log(error)
        }
    })
    socket.on("disconnect", () => {
        console.log("User disconnected")
        userSocketId.delete(user._id.toString());
    })
});

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`server is running on ${PORT} in ${envMode} Mode`);
})