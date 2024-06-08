import express from 'express'
import userRoute from './routes/userRoute.js'
import { connectDB } from './utils/features.js';
import dotenv from "dotenv";
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser'

dotenv.config({
    path: './.env'
})

connectDB(process.env.MONGO_URI)

const app = express();

//using middleware here
app.use(express.json());
app.use(cookieParser());


app.use('/user', userRoute)
app.get('/', (req, res) => {
    res.status(200).send('This is default page')
})

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})