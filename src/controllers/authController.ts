import { db } from "../database/db.ts";


export const authController =  {
    login: async (req: any, res: any) => {
        const { email, password } = req.body;
        return res.status(200).json({
            status: "success",
            message: "Login successful",
        })
    },
    register: async (req: any, res: any) => {}

}