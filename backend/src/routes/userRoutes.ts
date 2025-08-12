import express from "express";
import { fetchRole, loginUser, registerUser } from "../controller/userController";
import { isAuthenticated } from "../middleware/auth";


const userRouter=express.Router()

// TODO registering according to role homwowner and provider
userRouter.post('/register',registerUser)

// TODO login according to role homwowner and provider
userRouter.post('/login',loginUser)

userRouter.get('/fetch',isAuthenticated,fetchRole)


export default userRouter
