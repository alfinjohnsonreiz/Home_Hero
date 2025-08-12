import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    jwt.verify(token, "accesskey", (err:any, decoded:any) => {
      if (err) {
        // not 403
        return res.status(401).json({ msg: "Token invalid or expired" });
      }
      req.user = decoded; // attach user info
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

