import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  createServiceRequest,
  deleteServiceReq,
  fetchServiceReqAllWithProviderQuotes,
  fetchServiceReqOfLogOwner,
} from "../controller/serviceReqController";
import { upload } from "../utils/filemulter";

export const serviceRouter = express.Router();

// making an service request by homeowner
serviceRouter.post("/create", isAuthenticated,  upload.array("photos", 5),createServiceRequest);
// Deleting service req
serviceRouter.delete("/delete/:serviceReqId", isAuthenticated,deleteServiceReq);

// Getting specific services for specific homeowner logged
// ! only to specific home owner logged in
serviceRouter.get("/fetch-hm", isAuthenticated, fetchServiceReqOfLogOwner);

//! Getting all service requests showing to provider only
// !only for provider to see
serviceRouter.get("/fetchAll/provider", isAuthenticated, fetchServiceReqAllWithProviderQuotes);
