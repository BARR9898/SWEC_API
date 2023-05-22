

import { Query, now } from "mongoose"
import db from "../config/mysql"
import { query } from "express"
import { Request } from "express"
import moment from "moment"

const insertTerapeuta = async (terapeuta: any) => {
    const {nombre,apellido_materno,apellido_paterno} = terapeuta
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

const selectDates_agenda = async (querys?:any) => {

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

    console.log('filtro',filters);
    console.log('query',query);

    return filters
    
}




export { insertTerapeuta, selectDate, selectTerapeutas, updateDate, deleteDate , selectDates_agenda}