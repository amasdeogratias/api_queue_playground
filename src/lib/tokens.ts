import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const generateAccessToken = (userId: string) => {
    return jwt.sign(
        { 
            userId 
        },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
}

export const generateRefreshToken = (userId: string) => {
    return jwt.sign(
        {
            userId,
        },
        process.env.JWT_REFRESH_SECRET!,
        {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        }
    );
}