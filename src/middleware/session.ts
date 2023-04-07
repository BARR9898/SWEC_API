import { NextFunction,Response,Request } from "express"
import { verifyToken } from "../utils/jwt.handle";
import { JwtPayload } from "jsonwebtoken";

interface RequestExtend extends Request{
    user?: string | JwtPayload
}

const checkJWT = (req:RequestExtend,res:Response,next:NextFunction) => {
    try {
        
            const jwtUser = req.headers.authorization || 'null';
            const jwt = jwtUser.split(' ').pop();
            const isUser = verifyToken(`${jwt}`);

            if (!isUser) {
                res.status(401);
                res.send("TOKEN_NO_VALIDO")
                
            }else{

                req.user = isUser;
                next();
            }


        
    } catch (e) {
        console.log(e);
        
        res.status(400);
        res.send("SESSION_NO_VALID")
    }
}

export {checkJWT}