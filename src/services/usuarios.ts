

import { Query, now } from "mongoose"
import db from "../config/mysql"
import { query } from "express"
import { Request } from "express"
import moment from "moment"
import {registerNewUser} from '../services/auth'

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

const deleteUsuario = async (id: any) => {

    const [result_delete_terapeuta]:any = await db.pool.query('DELETE FROM usuarios WHERE id = ?',
    [id])

    if (!result_delete_terapeuta.affectedRows) {
        return false
    }



    return true
    
}

function createFilters(query:any){
    let filters = {
        desde: '',
        hasta:'',
        asistencia:''
    }
    
    query.desde == null || query.desde == '' ? 
       filters.desde = '' : filters.desde = `AND c.fecha >= '${query.desde}'`

    query.hasta == null || query.hasta == '' ? 
       filters.hasta = '' : filters.hasta = `AND c.fecha <= '${query.hasta}'`

    switch (query.asistencia) {
        case 'con asistencia':
            filters.asistencia = `AND c.asistencia = true`
            break;
        case 'sin asistencia':
            filters.asistencia = `AND c.asistencia = false`
            break;
        case 'pendientes':
                filters.asistencia = `AND c.asistencia = -1`
                break;
        default:
            filters.asistencia = ''

            break;
    }


    return filters
    
}




export { insertUsuario, selectUsuarios,deleteUsuario,selectUsuario}