import { Request, Response } from "express"

const isValidToken = (req: Request, res: Response) => {
    const user = req.user
    
    return res.status(200).json({
        success: true,
        message: "Token is valid",
        data: user
    })
}

export default isValidToken;