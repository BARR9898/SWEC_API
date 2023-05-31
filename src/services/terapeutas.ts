

import { Query, now } from "mongoose"
import db from "../config/mysql"
import { query } from "express"
import { Request } from "express"
import moment from "moment"

const insertTerapeuta = async (terapeuta: any) => {
    const {nombre,apellido_materno,apellido_paterno} = terapeuta

    const [result_select_terapeuta]:any = await db.pool.query('SELECT * FROM  terapeutas',[nombre,apellido_paterno,apellido_materno])
    
    if (result_select_terapeuta.length != 0) {
        return  'SOLO PUEDE EXISTIR UN TERAPEUTA'
    }

    const [result_insert_terapeuta]:any = await db.pool.query('INSERT INTO terapeutas VALUES (?,?,?,?)',[null,nombre,apellido_paterno,apellido_materno])
    if (result_insert_terapeuta.affectedRows  != 1) {
        return  null
    }
    return  result_insert_terapeuta
    
    
    

}

const selectTerapeutas = async () => { 

    const [result]:any = await db.pool.query('SELECT * FROM terapeutas')
    return result
        
}

const selectTerapeuta = async (id:string) => { 

    const [result]:any = await db.pool.query('SELECT * FROM terapeutas WHERE id =  ?',[id])
    return result
        
}

const deleteTerapeut = async (id: any) => {

    const [result_delete_terapeuta]:any = await db.pool.query('DELETE FROM terapeutas WHERE id = ?',
    [id])

    if (!result_delete_terapeuta.affectedRows) {
        return false
    }



    return true
    
}

const updateTerapeuta = async (terapeuta: any) => {
    const {id,nombre,apellido_materno,apellido_paterno} = terapeuta

    const [result_update_terapeuta]:any = await db.pool.query('UPDATE terapeutas  SET  nombre = ? , apellido_materno = ? ,  apellido_paterno = ? WHERE  id  = ?',[nombre,apellido_materno,apellido_paterno,id])
    
    if (result_update_terapeuta.affectedRows != 1) {
        return  false
    }

    return  true
    
    
    

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




export { insertTerapeuta, selectTerapeutas,deleteTerapeut,selectTerapeuta,updateTerapeuta}