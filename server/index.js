import express from 'express';
mongoose.set('strictQuery', false);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auths.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
const MongoURL="mongodb://127.0.0.1:27017/Youtube"

const connect= ()=>{
    mongoose.connect(MongoURL).then(()=>{
        console.log("Connected to MongoDB");
    }).catch(err=>{
        throw err;
    });
}

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/videos",videoRoutes)
app.use("/api/comments",commentRoutes)

app.use((err,req,res,next)=>{
    const status =err.status || 500;
    const message =err.message || "Something went wrong";
    return  res.status(status).json({
        success:false,
        status,
        message
    })
})

app.listen(8800,()=>{
    connect();
    console.log(" Conneted! server")
})