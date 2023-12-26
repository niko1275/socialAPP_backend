import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import postRoutes from './routes/posts.js';
import userRouter from './routes/user.js'
import fileUpload from 'express-fileupload';

const app = express();


app.use(cors());
app.use(express.json());

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
dotenv.config();
connectDB();



//routing
app.use('/posts', postRoutes);
app.use("/user", userRouter);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor Corriendo En el puerto ${PORT}`);
});
