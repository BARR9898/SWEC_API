import { Auth } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import { encrypt, verfied} from "../utils/bcrypt.handle";
import { generateToken } from "../utils/jwt.handle";
import {pool} from "../config/mysql"
import { Res } from "../interfaces/response";

const registerNewUser = async ({email,password,name,rol,lastname,second_lastname}:User) : Promise<Res> => {
    
    let response:Res = {
        result:false,
        data:[],
        message:''
    }

    const checkIs = await getUserByEmail(email)
    if (checkIs){
        response.result = false
        response.message = 'EL USUARIO YA EXISTE'
        return response
    }
    const passHash = await encrypt(password);
    const registerNewUser = await insertUser(email,passHash,name,rol,lastname,second_lastname);

    response.result = true
    response.message = 'USUARIOR REGISTRADO  CON EXITO'
    return response
}

const loginUser = async ({email,password}:Auth):Promise<Res> => {
   
    let response:Res = {
        result:false,
        data:[],
        message:''
    }

    const checkIs = await getUserByEmail(email)
    if (!checkIs){
        response.result = false
        response.message = 'USER NOT FOUND'
        return response
    }

    const passwordHash = checkIs.password; //Password encriptada desde BDD
    const isCorrect = await verfied(password,passwordHash);
    if(!isCorrect){
        response.result = false
        response.message = 'PASSWORD INCORRECT'
        return response
    }       
    const token = generateToken(checkIs.email);
    const data = {
        token,
        user: {
            id: checkIs.id,
            nombre: checkIs.nombre,
            apellido_paterno: checkIs.apellido_paterno,
            apellido_materno: checkIs.apellido_materno,
            rol: checkIs.rol,
        }
    }

    response.result = true
    response.message = 'LOGEO CORRECTO'
    response.data =  data
    return response
    /*
    */
}

async function getUserByEmail(email:string){
    try {
        const [rows]:any =  await pool.query("SELECT * FROM usuarios WHERE correo = ?" , [email])
        return rows[0]
    } catch (error) {
        console.log(error);
        
    }

   
}

async function insertUser(email:string,password:string,name:string,rol:string,lastname:string,second_lastname:string){
    try {
        const [result] = await pool.query("INSERT INTO usuarios (id,nombre,correo,password,rol,apellido_paterno,apellido_materno,estatus) VALUES (?,?,?,?,?,?,?,?)",[null,name,email,password,rol,lastname,second_lastname,true])
        return result
    } catch (error) {
        console.log('ERROR AL INSERTAR LA INFORMACION DEL NUEVO USUARIO',error);
    }
}

async function validateEmail(email:string) : Promise<Res>{
   
    let response:Res={
        result: false,
        data:[],
        message:''
    }

    try {

        const [select_user_result]:any = await pool.query('SELECT * FROM usuarios WHERE correo = ?',[email])
        
        if (select_user_result[0] == null) {
            response.message = "EL USUARIO NO ESTA REGISTRADO"
            response.result = false
            return response
        }

        response.message = "EL USUARIO ESTA REGISTRADO"
        response.data =  select_user_result[0]
        response.result = true

        return response

    } catch (error) {
        response.message = "OCURRIO UN ERROR EL VALIDAR EL USUARIO"
        response.data = error
        response.result = false
        return response
    }


    
} 

async function setPassword(userId:number,newPassword:string) : Promise<Res>{

    let response:Res = {
        result: false,
        message: '',
        data: []
    }

    try {

        const newPasswordHas = await encrypt(newPassword)
        const [result]:any = await pool.query("UPDATE usuarios SET password = ? WHERE id = ?",[newPasswordHas,userId])
        
        if(!result.changedRows){
            response.result = false,
            response.message =  'No se actualizo la contrasenia'
            return response
        }
    
        response.result = true
        response.message = 'Contrasenia actualizada con exito'
        return response

    } catch (error) {
        response.result = false
        response.message = 'ERROR ACTUALIZAR LA CONTRASENIA'
        response.data =  error
        return response
    }


    
    //const [delete_result]:any = await pool.query('DELETE FROM usuarios WHERE id = ?',[userId])


    
}

export {registerNewUser,loginUser,validateEmail,setPassword};