

import { Query, now } from "mongoose"
import db, { pool } from "../config/mysql"
import { query } from "express"
import { Request } from "express"
import moment from "moment"
import {registerNewUser} from '../services/auth'
import { Res } from "../interfaces/response"

const insertUsuario = async (usuario: any) => {
    const resulta_register_new_user = await registerNewUser(usuario)
    if(resulta_register_new_user.message == 'ALREADY_USER'){
        return  'ALREADY_USER'
    }else{
        return resulta_register_new_user
    }

}

const selectUsuarios = async () => { 

    const [result]:any = await db.pool.query('SELECT * FROM usuarios')
    return result
        
}

const selectUsuario = async (id:string) => { 

    const [result]:any = await db.pool.query('SELECT * FROM usuarios WHERE id =  ?',[id])
    return result
        
}

const deleteUsuario = async (id: any) : Promise<Res> => {
    let response:Res = {
        result: false,
        data: []
    }
    try {
        const [result_delete_terapeuta]:any = await db.pool.query('UPDATE usuarios SET estatus = ?  WHERE id = ?',
        [0,id])
    
        if (!result_delete_terapeuta.affectedRows) {
            response.result = false
            response.data = []
            response.message = 'El usuario no fue eliminado'

        }
    
    
        response.result = true
        response.data = []
        response.message = 'El usuario fue eliminado'

        return response
    } catch (error) {
        response.result = false
        response.data = error
        response.message = 'ERROR AL ACTUALIZAR EL USUARIO'
        return response
    }   

    
}

const updateUser = async (usuario:any,id:any): Promise<Res> => {
    
    let response:Res = {
        result: false,
        data: []
    }

    try {
        const {name,second_lastname,lastname,rol,email,estatus} = usuario
        const [resulta_update_user]:any = await pool.query('UPDATE usuarios SET nombre = ?,apellido_paterno = ?,apellido_materno = ?,rol = ?,correo = ?, estatus = ? WHERE id = ?',[name,lastname,second_lastname,rol,email,estatus,id])
        if (resulta_update_user.changedRows == 0) {
            response.result = false
            response.data = []
            response.message = 'El usuario no fue actualizado'

        }

        response.result = true
        response.data = []
        response.message = 'El usuario fue actualizado'

        return response
    } catch (error) {
        response.result = false
        response.data = error
        response.message = 'ERROR AL ACTUALIZAR EL USUARIO'
        return response
    }

}






export { insertUsuario, selectUsuarios,deleteUsuario,selectUsuario,updateUser}