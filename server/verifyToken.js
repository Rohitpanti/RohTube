import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()
import { createError } from "./error.js";

export const verifyToken=(req,res,next) => {
    const token=req.cookies.access_token
    if (!token) return next(createError(401,"You are not Authenticated!"));

    jwt.verify(token,process.env.JWT,(err,user)=>{
        if(err) return next(createError(403,"Invalid Token"));
        req.user=user;
        next()
    })
}