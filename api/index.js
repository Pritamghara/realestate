import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/Userroute.js';
import AuthRoute from './routes/Authroute.js'
import ListingRoute from './routes/ListingRoute.js'
import cookieParser from 'cookie-parser';
import path from 'path'
import exp from 'constants';


dotenv.config();


const app = express();
app.use(express.json())

app.use(cookieParser())


mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const __dirname=path.resolve()
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.use('/api/user',userRoute)
app.use('/api/auth',AuthRoute)
app.use('/api/listing',ListingRoute)
app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

app.use((err,req,res,next)=>{
    const statuscode=err.statuscode || 500;
    const message=err.message || 'Internal server error'
return res.status(statuscode).json({
    success:false,
    statuscode,
    message,
})
})