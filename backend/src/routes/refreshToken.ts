import express from "express";
import { createToken } from "../controller/tokenController";


const tokenRouter=express.Router()

tokenRouter.post('/',createToken)

export default tokenRouter