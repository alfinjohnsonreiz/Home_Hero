import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "accesskey"; 
const JWT_SECRET_REFRESH=process.env.JWT_SECRET_REFRESH || "refreshkey";

export const generateAccessToken=(user:any)=>{
    const token=jwt.sign(user,JWT_SECRET,{
        expiresIn:"10min"
    })
    return token
}

export const generateRefreshToken=(user:any)=>{
    const token=jwt.sign(user,JWT_SECRET_REFRESH,{
        expiresIn:"2h"
    })
    return token
}
