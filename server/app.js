import express from 'express'
import userRoute from './routes/userRoute.js'
import { connectDB } from './utils/features.js';
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})

connectDB(process.env.MONGO_URI)

const app = express();

//using middleware here
app.use(express.json());


app.use('/user', userRoute)
app.get('/', (req, res) => {
    res.status(200).send('This is default page')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})