import { hash } from "bcryptjs";
import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user";
import { encrypt, verfied } from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";
import {pool} from "../config/mysql"

const registerNewUser = async ({email,password,name,rol}:User) => {
    const checkIs = await getUserByEmail(email)
    console.log('checkIs',checkIs);
    if (checkIs) return "ALREADY_USER";
    const passHash = await encrypt(password);
    const registerNewUser = await registerUser(email,passHash,name,rol);
    return registerNewUser;
}

const loginUser = async ({email,password}:Auth) => {
    const checkIs = await getUserByEmail(email)
    if (!checkIs) return "NOT_FOUND_USER";
    const passwordHash = checkIs.password; //Password encriptada desde BDD
    console.log('passwordHash',passwordHash);
    const isCorrect = await verfied(password,passwordHash);
    if(!isCorrect) return  "PASSWORD_INCORRECT";    
    const token = generateToken(checkIs.email);
    const data = {
        token,
        user: checkIs
    }
    return data;
    /*
    */
}

async function getUserByEmail(email:string){
    try {
        const [rows]:any =  await pool.query("SELECT * FROM usuarios WHERE usuario = ?" , [email])
        console.log('getUserByEmail',rows[0]);
        return rows[0]
    } catch (error) {
        console.log(error);
        
    }

   
}

async function registerUser(email:string,password:string,name:string,rol:string){
    try {
        const [result] = await pool.query("INSERT INTO usuarios (id,nombre,usuario,password,rol) VALUES (?,?,?,?,?)",[null,name,email,password,rol])
        console.log(result);
        return result
        
    } catch (error) {
        console.log(error);
        return false
        
    }
}

export {registerNewUser,loginUser};