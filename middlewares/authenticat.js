import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authorization = async (req, res, next) => {
    try {
        const cookieName = 'jwtToken';

        const cookie = req.cookies?.[cookieName];
        const authHeader = req.headers?.authorization;

        const accessToken = cookie || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

        if(!accessToken){
            return res.status(400).json({
                success: false,
                message: 'Unauthorized no token found'
            })
        }

        const jwtUser = jwt.verify(accessToken, process.env.SECRET_KEY);

        if(!jwtUser || !jwtUser.id){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Invalid token payload'
            })
        }

        req.user = {id: jwtUser.id};
        next();

    } catch (error) {
        console.log('Error cause by ', error);
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Token is invalid'
            })
        }
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Token is expired'
            })
        }
        return res.status(500).json({
            success: false, 
            message: 'Internal server error during authorization'
        })
    }
}

export default authorization;