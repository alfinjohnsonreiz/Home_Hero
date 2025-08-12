import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import { fetchJobs, updateJobPaymentStatusToPaid, updateJobStatusToCompleted } from '../controller/jobController'

export const jobRouter=express.Router()

// ! job status scheduled->completed
jobRouter.put('/jobStatus/:jobId',isAuthenticated,updateJobStatusToCompleted)
// ! Payment status pending ->paid 
jobRouter.put('/payment/:jobId',isAuthenticated,updateJobPaymentStatusToPaid)


// TODO displaying
// ! Fetching job for homeowner or provider baaed on who logged
jobRouter.get('/fetch',isAuthenticated,fetchJobs)



