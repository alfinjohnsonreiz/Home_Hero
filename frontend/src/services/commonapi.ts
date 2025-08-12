import { type AxiosRequestConfig, type AxiosResponse, type Method } from "axios";
import axiosInstance from "./axiosInstance";

const commonAPI = async <T = any>(
  httpMethod: Method,
  url: string,
  reqBody?: any
): Promise<AxiosResponse<T>> => {
  // const token = localStorage.getItem("authToken");

  const reqConfig: AxiosRequestConfig = {
    method: httpMethod,
    url,
    data: reqBody,
    headers: {
      // ...(token && { Authorization: `Bearer ${token} `}),
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axiosInstance(reqConfig);
    return response;
  } catch (error: any) {
    if (error?.response?.status === 403) {
      console.warn("🔐 Token expired or invalid. Logging out...");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      alert("Your are logging out common api")
      window.location.href = "/login"; // force logout
    }
    console.log("error",error);
    
    throw error.response || error;
  }
};

export default commonAPI;