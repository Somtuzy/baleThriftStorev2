import jwt, { JwtPayload } from 'jsonwebtoken' 
import { IUser } from '../interfaces/user.interface'

// Generates a token by signing a user's unique details against a secret key whenever they sign in.
export const generateToken = async (payload: Partial <IUser>): Promise<string> => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {expiresIn: process.env.JWT_EXPIRES_IN})  
}

// Verifies the authenticity of a user by checking the validity of the user's token against the secret key
export const verifyToken = async (token: string): Promise<string | JwtPayload> => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY as string)  
}

export const checkTokenValidity = async (token: string): Promise<boolean> => {
    // Decode the token to extract the expiration date
    const decoded = jwt.decode(token);
    const _decoded = decoded as jwt.JwtPayload
    const expirationDate = new Date(_decoded.exp as number * 1000);

    // Checks if the token is expired
    if (token && expirationDate <= new Date()) {
        return false
      }
    return true
}

export const generateOTP = async (payload: Partial <IUser>): Promise<string> => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {expiresIn: process.env.JWT_OTP_EXPIRES_IN as string})  
}