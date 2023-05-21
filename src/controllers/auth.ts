import { Request,response,Response } from "express";
import { registerNewUser,loginUser,validateEmail,setPassword} from "../services/auth";
import mysql from "../config/mysql";

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

const existEmail = async({body}: Request,res:Response) => {
    const {email} = body;
    const emailExist = await validateEmail(email);
    
    if(emailExist == false){
        res.send({
           result:false
        }) 
        
    }else{
        res.send({
            result: true,
            data: emailExist
        })
    }




}

const resetPassword  =  async({body}: Request,res:Response) => {
    const {email,userId,newPassword} = body;
    const passwordWasSeted = await setPassword(email,userId,newPassword);
    if(passwordWasSeted?.result){
        res.send({
            result:true
        })
    }else{
        res.send({
            result:false
        })
    }
    
    /*
    if(emailExist == false){
        res.send({
           result:false
        }) 
        
    }else{
        res.send({
            result: true,
            data: emailExist
        })
    }
    */




}



export {loginController,registerController,existEmail,resetPassword}