import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from "bcrypt";
import { createError } from '../error.js';
import  jwt  from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
//import { body, validationResult } from "express-validator";


//Sign Up
export const signup = async (req,res,next)=>{
    try{
        //To hide the Orginal Password we use bcrypt npm package that hashes the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser= new User({...req.body, password:hash});
        await newUser.save();

        res.status(200).send("User Has Been Created");
    }catch(err){
        next(err);
    }
}


//Sign in
export const signin = async (req,res,next)=>{
    try{
        //Here we find the user's credentials with reference to unique object i.e name in DB if user with same name exist it throws an error
        const user= await User.findOne({name:req.body.name});
        if(!user) return next(createError(404,"User Not Found"));

        //The Encrypted password is Checked here  if the password doesnt match it will throw here
        const isCorrect= await bcrypt.compare(req.body.password,user.password);
        if(!isCorrect) return next(createError(400,"Wrong Credentials"));

        //If the user is valid to enter we generate a acces token  for him which will be present in the cookies 
        const token=jwt.sign({id:user._id},process.env.JWT);
        const {password, ...others} =user._doc;

        res
            .cookie("access_token",token,{
            httpOnly:true,
        })
        res.status(200)
        .json(others);
    }catch(err){
        next(err);
    }
}

//Sginin using Google
export const googleAuth=async(req,res,next)=>{
    try{
        const user= await User.findOne({email:req.body.email});
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT);
            res
                .cookie("access_token",token,{
                httpOnly:true,
            })
            .status(200)
            .json(user._doc);

        }else{
            const newUser= new User({
                ...req.body,
                fromGoogle:true
            })
        const savedUser= await newUser.save();
        const token=jwt.sign({id:savedUser._id},process.env.JWT);
        res
            .cookie("access_token",token,{
            httpOnly:true,
        })
        .status(200)
        .json(savedUser._doc);
        }
    }catch(err){
        next(err);
    }
}