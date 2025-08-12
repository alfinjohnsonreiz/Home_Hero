import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import { acceptQuote, createQuote, fetchQuotesByServiceReqId, fetchQuotesToHomeOwner, fetchQuotesToProvider } from '../controller/quoteController'

export const quoteRouter=express.Router()

// !creating quotes by provider to the service requests
quoteRouter.post('/create/serviceReq/:serviceRequestId',isAuthenticated,createQuote)

// !Fetching quotes for specific service requests
// provider has displayed all serviceReq for homeowner only specific serviceReq
quoteRouter.get('/fetch/serviceReqId/:serviceRequestId',isAuthenticated,fetchQuotesByServiceReqId)
//! Accepting quotes by owner
// TODO Accepting
quoteRouter.post('/accept/Quote/:quoteId',isAuthenticated,acceptQuote)



// TODO displaying
//! Fetching home owner quotes logged in ^^^^^change^^^^
quoteRouter.get('/fetch/homeowner',isAuthenticated,fetchQuotesToHomeOwner)
//! fetching provider quotes logged in
quoteRouter.get('/fetch/provider',isAuthenticated,fetchQuotesToProvider)
