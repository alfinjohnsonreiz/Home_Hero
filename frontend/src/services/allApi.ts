import commonAPI from "./commonapi";

export const registerUser = async (formdata: any) => {
  return commonAPI("post", `/auth/register`, formdata);
};

export const loginUser = async (formdata: any) => {
  return commonAPI("post", `/auth/login`, formdata);
};

export const listServiceReqhm = async () => {
  return commonAPI("GET", "/serviceReq/fetch-hm");
};

export const acceptQuote = async (quoteId: any) => {
  return commonAPI("POST", `/quote/accept/Quote/${quoteId}`);
};

export const markComplete = async (jobId: any) => {
  return commonAPI("PUT", `/job/jobStatus/${jobId}`);
};

export const createReview = async (jobId: any, formdata: any) => {
  return commonAPI("POST", `/review/job/${jobId}`, formdata);
};

export const deleteServiceReq=async(serviceReqId:number)=>{
  return commonAPI('DELETE',`/serviceReq/delete/${serviceReqId}`)
}
// ! job fetching based on logged in role
export const listJobs = async () => {
  return commonAPI("GET", `/job/fetch`);
};

//! fetching role
export const fetchUser=async()=>{
  return commonAPI("GET","/auth/fetch")
}


//! Provider
export const listServiceReqpr = async () => {
  return commonAPI("GET", `/serviceReq/fetchAll/provider`); //all service requests
};

export const addQuote = async (serviceReqId: any, formdata: any) => {
  return commonAPI(
    "POST",
    `/quote/create/serviceReq/${serviceReqId}`,
    formdata
  );
};

export const listQuote = async () => {
  return commonAPI("GET", "/quote/fetch/provider");
};

export const markPaid = async (jobId: number) => {
  return commonAPI("PUT", `/job/payment/${jobId}`);
};

// !Payment

export const makePay=async(jobId:number)=>{
  return commonAPI("POST",`/pay/${jobId}`)
}