

import { Query, now } from "mongoose"
import db from "../config/mysql"
import { query } from "express"
import { Request } from "express"
import moment from "moment"

const insertCita = async (cita: any) => {
    const {status,asistencia,id_paciente,fecha} = cita
        
    const [result]:any = await db.pool.query('INSERT INTO citas (id,fecha,status,asistencia) VALUES (?,?,?,?)',
    [null,fecha,status,asistencia])

    console.log('result insert cita',result);
    

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
    console.log('querys',querys);
 

    if (querys.desde == '' && querys.hasta == '') {
        const [result]:any = await db.pool.query('SELECT citas.id,citas.status,citas.asistencia,citas.fecha from citas INNER JOIN citas_pacientes cp on cp.id_cita =  citas.id INNER JOIN pacientes  on cp.id_paciente =  pacientes.id WHERE pacientes.id = ?',
        [id_paciente])
        console.log('result',result);
        return result
    }else if(querys.desde != '' && querys.hasta == ''){
        let hoy = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()} 11:59:59`
        const [result]:any = await db.pool.query('SELECT citas.id,citas.status,citas.asistencia,citas.fecha from citas INNER JOIN citas_pacientes cp on cp.id_cita =  citas.id INNER JOIN pacientes  on cp.id_paciente =  pacientes.id WHERE pacientes.id = ? AND citas.fecha >= ? AND citas.fecha <= ?',
        [id_paciente,querys.desde,hoy])
        console.log('result',result);
        return result
    }else if(querys.desde == '' && querys.hasta != ''){
        const [result]:any = await db.pool.query('SELECT citas.id,citas.status,citas.asistencia,citas.fecha from citas INNER JOIN citas_pacientes cp on cp.id_cita =  citas.id INNER JOIN pacientes  on cp.id_paciente =  pacientes.id WHERE pacientes.id = ?  AND citas.fecha <= ?',
        [id_paciente,querys.hasta])
        console.log('result',result);
        return result
    }else{
        const [result]:any = await db.pool.query('SELECT citas.id,citas.status,citas.asistencia,citas.fecha from citas INNER JOIN citas_pacientes cp on cp.id_cita =  citas.id INNER JOIN pacientes  on cp.id_paciente =  pacientes.id WHERE pacientes.id = ? AND citas.fecha >= ? AND citas.fecha <= ?',
        [id_paciente,querys.desde,querys.hasta])
        console.log('result',result);
        return result
    }

    


    
}

const selectDates_agenda = async (querys?:any) => {

    let filters = createFilters(querys);
    console.log('query', `SELECT c.*,CONCAT(p.nombre, " ", p.apellido_paterno, " ", p.apellido_materno) as nombre FROM citas c INNER JOIN citas_pacientes cp on cp.id_cita = c.id INNER JOIN pacientes p on p.id = cp.id_paciente WHERE c.id = cp.id_cita ${filters.desde} ${filters.hasta} ${filters.asistencia}`);
    
 
    const [result]:any = await db.pool.query(`SELECT c.*,CONCAT(p.nombre, " ", p.apellido_paterno, " ", p.apellido_materno) as nombre FROM citas c INNER JOIN citas_pacientes cp on cp.id_cita = c.id INNER JOIN pacientes p on p.id = cp.id_paciente WHERE c.id = cp.id_cita ${filters.desde} ${filters.hasta} ${filters.asistencia}`)
    console.log('result',result);
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

    console.log('result',result);
    
    
    return result
}

const deleteDate = async (id: any) => {

  

    console.log('id',id);

    const [result_delete_pacientes_citas]:any = await db.pool.query('DELETE FROM citas_pacientes WHERE id_cita = ?',
    [id])

    if (!result_delete_pacientes_citas.affectedRows) {
        return false
    }
    
    const [result]:any = await db.pool.query('DELETE FROM citas WHERE id = ?',
    [id])
    console.log('result',result);
    
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

    console.log('querys d',query);
    
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
        default:
            filters.asistencia = ''

            break;
    }

    console.log('filters',filters);

    return filters
    
}




export { insertCita, selectDate, selectDates, updateDate, deleteDate , selectDates_agenda}