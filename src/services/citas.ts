

import { Query, now } from "mongoose"
import db from "../config/mysql"
import { query } from "express"
import { Request } from "express"
import moment from "moment"
import { Res } from "../interfaces/response"

const insertCita = async (cita: any) : Promise<Res> =>  {

    let response:Res = {
        result: false,
        data: []
    }
    const {status,asistencia,id_paciente,fecha} = cita

    const [evaluateIfDateExist]:any = await db.pool.query('SELECT * FROM citas WHERE citas.fecha = ?',[fecha])
    if (evaluateIfDateExist.length != 0) {

        response.result = true
        response.data = []
        response.message = "Ya existe una cita registrada para esta fecha"

        return response
    }
    
        
    const [result]:any = await db.pool.query('INSERT INTO citas (id,fecha,status,asistencia) VALUES (?,?,?,?)',
    [null,fecha,status,asistencia])    

    if(!result.insertId){
        response.result = false
        response.data = []
        response.message = "Ocurrio un error al registrar la cita"
        return response

    }

    let id_cita =  result.insertId

    const [result_insert_pacientes_citas]:any = await db.pool.query('INSERT INTO citas_pacientes (id,id_paciente,id_cita) VALUES (?,?,?)',
    [null,id_paciente,id_cita])

    if(!result_insert_pacientes_citas.insertId){
        response.result = false
        response.data = []
        response.message = "Ocurrio un error al relacionar la cita con el paciente"
        return response    
    }
    
    response.result = true
    response.data = []
    response.message = "Cita registrada con exito"
    return response
    
    
    

}

const selectDates = async (id_paciente:any,id_usuario:any,querys?:any) => { 
id_usuario = 1;
    if (querys.desde == '' && querys.hasta == '') {
        const [result]:any = await db.pool.query('SELECT citas.id,citas.status,citas.asistencia,citas.fecha from citas INNER JOIN citas_pacientes cp on cp.id_cita =  citas.id INNER JOIN pacientes  on cp.id_paciente =  pacientes.id WHERE pacientes.id = ?',
        [id_paciente])
        return result
    }else if(querys.desde != '' && querys.hasta == ''){
        let hoy = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()} 23:59:59`
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

const selectDates_agenda = async (user_id:string,querys?:any) => {

    let filters = createFilters(querys);
 
    const [result]:any = await db.pool.query(`SELECT e.id as expediente_id,c.*,CONCAT(p.nombre, " ", p.apellido_paterno, " ", p.apellido_materno) as nombre FROM citas c 
    INNER JOIN citas_pacientes cp on cp.id_cita = c.id 
    INNER JOIN pacientes p on p.id = cp.id_paciente
    INNER JOIN expedientes_pacientes ep on p.id = ep.id_paciente
    INNER JOIN expedientes e on e.id = ep.id_expediente
    WHERE c.id = cp.id_cita  ${filters.desde} ${filters.hasta} ${filters.asistencia}

    AND c.status  = true`)
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

const deleteDate = async (id: any) : Promise<Res> => {

    let  response:Res = {
        result: false,
        data: []
    }

    try {
        const [result_delete_pacientes_citas]:any = await db.pool.query('DELETE FROM citas_pacientes WHERE id_cita = ?',
        [id])
    
        if (!result_delete_pacientes_citas.affectedRows) {
            response.result = false,
            response.message =  'Error al eliminar la relacion cita - paciente'
            return response
        }
        
        const [result]:any = await db.pool.query('DELETE FROM citas WHERE id = ?',
        [id])
        
        if (!result.affectedRows) {
            response.result = false,
            response.message =  'Error al eliminar la cita'
            return response
        }

        response.result = true,
        response.message =  'Ciita eliminada con exiito'
        return response

    } catch (error) {
        response.result = false,
        response.message =  'Ocurrio un error al realiizar la operacion'
        return response
        
    }    
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




export { insertCita, selectDate, selectDates, updateDate, deleteDate , selectDates_agenda}