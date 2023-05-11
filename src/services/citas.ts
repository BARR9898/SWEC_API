

import { Query, now } from "mongoose"
import db from "../config/mysql"
import { query } from "express"
import { Request } from "express"
import moment from "moment"

const insertCita = async (cita: any) => {
    const {status,asistencia,id_paciente,fecha} = cita
        
    const [result]:any = await db.pool.query('INSERT INTO citas (id,fecha,status,asistencia) VALUES (?,?,?,?)',
    [null,fecha,status,asistencia])    

    if(!result.insertId){
        return false
    }

    let id_cita =  result.insertId

    const [result_insert_pacientes_citas]:any = await db.pool.query('INSERT INTO citas_pacientes (id,id_paciente,id_cita) VALUES (?,?,?)',
    [null,id_paciente,id_cita])

    if(!result_insert_pacientes_citas.insertId){
        return false
    }
    
    return true
    
    
    

}

const selectDates = async (id_paciente:any,querys?:any) => { 

    if (querys.desde == '' && querys.hasta == '') {
        const [result]:any = await db.pool.query('SELECT citas.id,citas.status,citas.asistencia,citas.fecha from citas INNER JOIN citas_pacientes cp on cp.id_cita =  citas.id INNER JOIN pacientes  on cp.id_paciente =  pacientes.id WHERE pacientes.id = ?',
        [id_paciente])
        return result
    }else if(querys.desde != '' && querys.hasta == ''){
        let hoy = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()} 11:59:59`
        const [result]:any = await db.pool.query('SELECT citas.id,citas.status,citas.asistencia,citas.fecha from citas INNER JOIN citas_pacientes cp on cp.id_cita =  citas.id INNER JOIN pacientes  on cp.id_paciente =  pacientes.id WHERE pacientes.id = ? AND citas.fecha >= ? AND citas.fecha <= ?',
        [id_paciente,querys.desde,hoy])
        return result
    }else if(querys.desde == '' && querys.hasta != ''){
        const [result]:any = await db.pool.query('SELECT citas.id,citas.status,citas.asistencia,citas.fecha from citas INNER JOIN citas_pacientes cp on cp.id_cita =  citas.id INNER JOIN pacientes  on cp.id_paciente =  pacientes.id WHERE pacientes.id = ?  AND citas.fecha <= ?',
        [id_paciente,querys.hasta])
        return result
    }else{
        const [result]:any = await db.pool.query('SELECT citas.id,citas.status,citas.asistencia,citas.fecha from citas INNER JOIN citas_pacientes cp on cp.id_cita =  citas.id INNER JOIN pacientes  on cp.id_paciente =  pacientes.id WHERE pacientes.id = ? AND citas.fecha >= ? AND citas.fecha <= ?',
        [id_paciente,querys.desde,querys.hasta])
        return result
    }

    


    
}

const selectDates_agenda = async (querys?:any) => {

    let filters = createFilters(querys);
 
    const [result]:any = await db.pool.query(`SELECT e.id as expediente_id,c.*,CONCAT(p.nombre, " ", p.apellido_paterno, " ", p.apellido_materno) as nombre FROM citas c 
    INNER JOIN citas_pacientes cp on cp.id_cita = c.id 
    INNER JOIN pacientes p on p.id = cp.id_paciente
    INNER JOIN expedientes_pacientes ep on p.id = ep.id_paciente
    INNER JOIN expedientes e on e.id = ep.id_expediente
    WHERE c.id = cp.id_cita  ${filters.desde} ${filters.hasta} ${filters.asistencia}`)
    return result    
}

const selectDate = async (id: any) => {
    const [result]:any = await db.pool.query('SELECT id,status,fecha,asistencia FROM citas WHERE id  = ?',
    [id])
    if (!result) {
        return null
    }
    return result
}

const updateDate = async (id: any, data: any) => {
    const {status,asistencia,fecha} =  data
    
    const [result]:any = await db.pool.query(`UPDATE citas SET fecha = '${fecha}', asistencia = ${asistencia}, status = ${status} WHERE citas.id = ${id}`)    
    
    return result
}

const deleteDate = async (id: any) => {

    const [result_delete_pacientes_citas]:any = await db.pool.query('DELETE FROM citas_pacientes WHERE id_cita = ?',
    [id])

    if (!result_delete_pacientes_citas.affectedRows) {
        return false
    }
    
    const [result]:any = await db.pool.query('DELETE FROM citas WHERE id = ?',
    [id])
    
    if (!result.affectedRows) {
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
        case 'true':
            filters.asistencia = `AND c.asistencia = 1`
            break;
        case 'false':
            filters.asistencia = `AND c.asistencia = 0`
            break;
        case 'null':
                filters.asistencia = `AND c.asistencia = null`
                break;
        default:
            filters.asistencia = ''

            break;
    }

    return filters
    
}




export { insertCita, selectDate, selectDates, updateDate, deleteDate , selectDates_agenda}