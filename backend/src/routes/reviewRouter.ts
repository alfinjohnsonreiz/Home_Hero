import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import { reviewForJob } from '../controller/reviewController'

export const revieRouter=express.Router()

revieRouter.post('/job/:jobId',isAuthenticated,reviewForJob)