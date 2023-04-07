import { Request,response,Response } from "express";
import { registerNewUser,loginUser } from "../services/auth";

const registerController = async ({body} :Request,res:Response) => {
    try {
        const responseUser = await registerNewUser(body);        
        res.send(responseUser);
    } catch (e) {
        res.status(500)
    }

}

const loginController = async ({body}: Request,res:Response) => {
    const {email,password} = body;
    const responseUser = await loginUser({email,password});
    if(responseUser === 'PASSWORD_INCORRECT'){
       res.send(responseUser);
    }else{
        res.send(responseUser);

    }
}

export {loginController,registerController}