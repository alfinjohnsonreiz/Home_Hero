import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { makePayment } from "../controller/payController";

export const payRouter=express.Router()

payRouter.post('/:jobID',isAuthenticated,makePayment)
