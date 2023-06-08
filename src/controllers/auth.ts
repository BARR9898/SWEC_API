import { Request,response,Response } from "express";
import { registerNewUser,loginUser,validateEmail,setPassword} from "../services/auth";
import mysql from "../config/mysql";
import { handleError } from "../middleware/handleError";

const registerController = async ({body} :Request,res:Response) => {
    try {
        const responseUser = await registerNewUser(body);        
        res.send(responseUser);
    } catch (e) {
        handleError('OCURRIO UN ERROR AL TRATAR DE REGISTRAR EL USUARIO')
    }

}

const loginController = async ({body}: Request,res:Response) => {
    try {
        const {email,password} = body;
        const responseItem = await loginUser({email,password});
        res.send(responseItem)
    } catch (error) {
        handleError('ERROR AL LOGEARSE')
    }

}

const existEmail = async({body}: Request,res:Response) => {
    try {
        const {email} = body;
        const responseItem = await validateEmail(email);
        res.send(responseItem)    
    } catch (error) {
        handleError('NO SE PUDO  VALIDAR SI EL USUARIO EXISTE PARA CAMBIAR LA CONTRASENIA')
    }

}

const resetPassword  =  async({body}: Request,res:Response) => {

    try {
        const {user_id,new_password} = body;
        const responseItem = await setPassword(user_id,new_password);
        res.send(responseItem)
    } catch (error) {
        handleError('ERROR AL CAMBIAR LA CONTRASENIA')
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