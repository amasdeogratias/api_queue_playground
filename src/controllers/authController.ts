import type { Request, Response } from 'express';
import { users } from "#/database/schema.ts";
import { db } from "../database/db.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateAccessToken, generateRefreshToken } from "#/lib/tokens.ts";


const UserSchema = z.object({
    name: z.string().min(3, "Name cannot be empty"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const authController =  {
    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Email and password are required",
            })
        }

        const normalizedEmail = email.toLowerCase();

        try {

            const user = await db.select().from(users).where(eq(users.email, normalizedEmail))

            if(!user[0]) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid email or password"
                })
            }

            const isPasswordValid = await bcrypt.compare(password, user[0].password);
            if(!isPasswordValid) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid email or password"
                })
            }

            // generate a token
            const accessToken = generateAccessToken(user[0].id);
            const refreshToken = generateRefreshToken(user[0].id);

            // Set the refresh token in an HTTP-only cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Set to true in production
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            

            return res.status(200).json({
                status: "success",
                message: "Login successful",
                accessToken,
                refreshToken,
            });

        }catch (error) {
            console.error(error);

            return res.status(500).json({
                status: "error",
                message: "Something went wrong",
            });
        }
        
    },

    register: async (req: Request, res: Response) => {
        const validatedData = UserSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                status: "error",
                message: validatedData.error.issues,
            })
        }

        try {
            const newEmail = validatedData.data.email.toLowerCase();
            const existingUser = await db.select().from(users).where(eq(users.email, newEmail)).limit(1);
            if (existingUser[0]) {
                return res.status(400).json({
                    status: "error",
                    message: "User with this email already exists",
                })
            }

            //hashthe password before storing it in the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(validatedData.data.password, salt);

            await db.insert(users).values({
                name: validatedData.data.name,
                email: newEmail,
                password: hashedPassword,
            });
            return res.status(201).json({
                status: "success",
                message: "User registered successfully",
            })
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "An error occurred while registering the user",
            })
        }
    }
}