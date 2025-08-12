import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/token";
export const createToken = async (req: Request, res: Response) => {
  try {
    console.log("First call in refershtoken api")
    const refreshToken = req.cookies.refreshToken;
    console.log("Call hitted",refreshToken);
    
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify the token
    jwt.verify(refreshToken, "refreshkey", (err:any, decoded:any) => {
      if (err) {
        // 403 
        return res.status(401).json({ message: "Invalid refresh token" });
      }
      // decoded is the payload you signed originally
      // Generate new access token based on decoded payload
      const accessToken = generateAccessToken({ u_id: decoded.u_id, role: decoded.role });
      console.log("call hit 1 refreshtoken",accessToken)

      // Send the access token in response
      return res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
