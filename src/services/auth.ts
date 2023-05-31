import { hash } from "bcryptjs";
import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import UserModel from "../models/user";
import { encrypt, verfied} from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";
import {pool} from "../config/mysql"

const registerNewUser = async ({email,password,name,rol,lastname,second_lastname}:User) => {
    const checkIs = await getUserByEmail(email)
    if (checkIs) return "ALREADY_USER";
    const passHash = await encrypt(password);
    const registerNewUser = await registerUser(email,passHash,name,rol,lastname,second_lastname);
    return registerNewUser;
}

const loginUser = async ({email,password}:Auth) => {
    const checkIs = await getUserByEmail(email)
    if (!checkIs) return "NOT_FOUND_USER";
    const passwordHash = checkIs.password; //Password encriptada desde BDD
    const isCorrect = await verfied(password,passwordHash);
    if(!isCorrect) return  "PASSWORD_INCORRECT";    
    const token = generateToken(checkIs.email);
    const data = {
        token,
        user: {
            id: checkIs.id,
            nombre: checkIs.nombre,
            apellido_paterno: checkIs.lastname,
            apellido_materno: checkIs.second_lastname,
            rol: checkIs.rol,



        }
    }
    return data;
    /*
    */
}

async function getUserByEmail(email:string){
    try {
        const [rows]:any =  await pool.query("SELECT * FROM usuarios WHERE usuario = ?" , [email])
        return rows[0]
    } catch (error) {
        console.log(error);
        
    }

   
}

async function registerUser(email:string,password:string,name:string,rol:string,lastname:string,second_lastname:string){
    try {
        const [result] = await pool.query("INSERT INTO usuarios (id,nombre,usuario,password,rol,lastname,second_lastname) VALUES (?,?,?,?,?,?,?)",[null,name,email,password,rol,lastname,second_lastname])
        return result
        
    } catch (error) {
        return false
        
    }
}

async function validateEmail(email:string){
    const [result]:any = await pool.query('SELECT * FROM usuarios WHERE usuario = ?',[email])
    if (result[0] != null) {
        return result[0]
    }
    return false

    
}

async function setPassword(email:string,userId:number,newPassword:string){

    const [select_user_result]:any = await pool.query('SELECT * FROM usuarios WHERE id = ?',[userId])
    if (!select_user_result[0]) {
        return
    }

    const [delete_user_result]:any = await pool.query('DELETE FROM usuarios WHERE id = ?',[userId])

    const user_data = select_user_result[0]





    let user_new_data:User =  {
        name: user_data.nombre,
        rol: user_data.rol,
        password: newPassword,
        description:  '',
        email: user_data.usuario,
        lastname:user_data.lastname,
        second_lastname:user_data.second_lastname

    }

    const result_register_user:any = await registerNewUser(user_new_data)



    
    if (result_register_user.affectedRows != 1) {
        let response =  {
            result:false,
            message:"contraseña no modificada "
        }
        return response
    }else{
        let response =  {
            result:true,
            message:"contraseña modificada "
        }
        return response
    }

    
    //const [delete_result]:any = await pool.query('DELETE FROM usuarios WHERE id = ?',[userId])


    
}

export {registerNewUser,loginUser,validateEmail,setPassword};