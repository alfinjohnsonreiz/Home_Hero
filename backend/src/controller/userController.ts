import { Request, Response } from "express";
import {
  serviceCreateUser,
  serviceGetUserByEmail,
} from "../services/User.services";
import {
  serviceAddHomeOwner,
  serviceGetHomeOwnerById,
  serviceGetHomeOwnerByUserId,
} from "../services/homeOwner.service";
import {
  HomeownerRequestBody,
  LoginUserFields,
  ProviderRequestBody,
  UserRequestBody,
} from "../types/types";
import { Role } from "../entity/User";
import {
  serviceAddProvider,
  serviceGetProviderByUserId,
} from "../services/Provider.service";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

function isHomeowner(body: UserRequestBody): body is HomeownerRequestBody {
  return body.role === "homeowner";
}

function isProvider(body: UserRequestBody): body is ProviderRequestBody {
  return body.role === "provider";
}
// TODO REGISTER
export const registerUser = async (
  req: Request<{}, {}, UserRequestBody>,
  res: Response
) => {
  try {
    const body = req.body;

    const { name, email, password, role } = body;
    console.log("Call hitted register");
    console.log(role);
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, msg: "Missing required fields" });
    }

    const userExists = await serviceGetUserByEmail(email);
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isHomeowner(body)) {
      //! checking homwowner
      if (!body.contactNumber || !body.address) {
        return res
          .status(400)
          .json({ success: false, msg: "Missing homeowner details" });
      }
      const newUser = await serviceCreateUser({
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      });

      await serviceAddHomeOwner(body.contactNumber, body.address, newUser.u_id);
    } else if (isProvider(body)) {
      if (!body.serviceCategory || !body.skills || !body.certification) {
        return res
          .status(400)
          .json({ success: false, msg: "Missing provider details" });
      }
      const newUser = await serviceCreateUser({
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      });

      //! checkin provider
      await serviceAddProvider(
        body.serviceCategory,
        body.skills,
        body.certification,
        newUser.u_id
      );
    } else {
      return res.status(400).json({ success: false, msg: "Invalid role" });
    }
    return res.status(201).json({
      success: true,
      msg: "User registered successfully ",
      role: role,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message || "Internal server error" });
  }
};
// TODO LOGIN
export const loginUser = async (
  req: Request<{}, {}, LoginUserFields>,
  res: Response
) => {
  try {
    const body = req.body;
    const { email, password } = body;

    const userExists = await serviceGetUserByEmail(email);
    if (!userExists) {
      return res.status(400).json({ success: false, msg: "User Not exists" });
    }
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, msg: "Incorrect password" });
    }

    // Getting role specific id
    let roleSpecificId = null;
    if (userExists.role === "homeowner") {
      roleSpecificId = await serviceGetHomeOwnerById(userExists.u_id);
    } else if (userExists.role === "provider") {
      roleSpecificId = await serviceGetProviderByUserId(userExists.u_id);
    }
    const token = generateAccessToken({
      u_id: userExists.u_id,
      role: userExists.role,
    });

    const refreshToken = generateRefreshToken({
      u_id: userExists.u_id,
      role: userExists.role,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });
    return res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      user: {
        u_id: userExists.u_id,
        name: userExists.name,
        email: userExists.email,
        role: userExists.role,
        role_id: roleSpecificId,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message || "Internal server error" });
  }
};

export const fetchRole = async (req: any, res: Response) => {
  try {
    const { u_id, role } = req.user;
    console.log("hit",role)
    if (role == "homeowner") {
      const homeowner = await serviceGetHomeOwnerByUserId(u_id);
      if (!homeowner) {
        return res.status(400).json({ success: false, ms: "NO homeowner" });
      }
      return res.status(200).json({ success: true, data: homeowner });
    } 
    else if (role == "provider") {
      const provider = await serviceGetProviderByUserId(u_id);
      if (!provider){
        return res.status(400).json({ success: false, ms: "NO Provider" });
      }
      console.log("hit")
      return res.status(200).json({ success: true, data: provider });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message || "Internal server error" });
  }
};
