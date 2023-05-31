

import { Query, now } from "mongoose"
import db from "../config/mysql"
import { query } from "express"
import moment from "moment"

const insertNota = async (data: any) => {
    const {fecha,nota,id_paciente} = data
        
    
    const [result]:any = await db.pool.query('INSERT INTO notas_clinicas (id,fecha_creacion,nota) VALUES (?,?,?)',
    [null,fecha,nota])

    

    if(!result.insertId){
        return false
    }

    let id_nota =  result.insertId

    const [result_get_expediente]:any = await db.pool.query('SELECT id_expediente FROM expedientes_pacientes WHERE id_paciente = ?',
    [id_paciente])


    let id_expediente = result_get_expediente[0].id_expediente

    

    
    const [result_insert_expedientes_notas]:any = await db.pool.query('INSERT INTO expedientes_notas_clinicas (id,id_expediente,id_nota_clinica) VALUES (?,?,?)',
    [null,id_expediente,id_nota])

    if(!result_insert_expedientes_notas.insertId){
        return false
    }
    
    return true
    
    
    

}

const selectNotes = async (id_expediente:any,querys?:any) => {
 

    if (querys.desde == '' && querys.hasta == '') {
        const [result]:any = await db.pool.query('SELECT notas.id,notas.fecha_creacion,notas.nota FROM notas_clinicas as notas INNER JOIN expedientes_notas_clinicas enc on enc.id_nota_clinica = notas.id INNER JOIN expedientes e on e.id = enc.id_expediente WHERE e.id =?',
        [id_expediente])
        return result
    }else if(querys.desde != '' && querys.hasta == ''){
        let hoy = moment(new Date()).format('YYYY-MM-DD h:mm:ss')       
        const [result]:any = await db.pool.query('SELECT notas.id,notas.fecha_creacion,notas.nota FROM notas_clinicas as notas INNER JOIN expedientes_notas_clinicas enc on enc.id_nota_clinica = notas.id INNER JOIN expedientes e on e.id = enc.id_expediente WHERE e.id = ? AND notas.fecha_creacion >= ?',
        [id_expediente,querys.desde])
        return result
    }else if(querys.desde == '' && querys.hasta != ''){
        const [result]:any = await db.pool.query('SELECT notas.id,notas.fecha_creacion,notas.nota FROM notas_clinicas as notas INNER JOIN expedientes_notas_clinicas enc on enc.id_nota_clinica = notas.id INNER JOIN expedientes e on e.id = enc.id_expediente WHERE e.id = ?  AND notas.fecha_creacion <= ?',
        [id_expediente,querys.hasta])
        return result
    }else{
        const [result]:any = await db.pool.query('SELECT notas.id,notas.fecha_creacion,notas.nota FROM notas_clinicas as notas INNER JOIN expedientes_notas_clinicas enc on enc.id_nota_clinica = notas.id INNER JOIN expedientes e on e.id = enc.id_expediente WHERE e.id = ? AND notas.fecha_creacion >= ? AND notas.fecha_creacion <= ?',
        [id_expediente,querys.desde,querys.hasta])
        return result
    }

    


    
}

const selectNote = async (id: any) => {
    const [result]:any = await db.pool.query('SELECT n.id,n.nota,n.fecha_creacion FROM notas_clinicas as n WHERE id  = ?',
    [id])
    if (!result) {
        return null
    }
    return result
}

const updateDate = async (id: any, data: any) => {
    const {status,asistencia,fecha} =  data
    let fechaToDate = new Date(fecha)
    let fecha_formated = `${fechaToDate.getUTCFullYear()}-${fechaToDate.getMonth()}-${fechaToDate.getUTCDay()} ${fechaToDate.getUTCHours()}:${fechaToDate.getUTCMinutes()}:${fechaToDate.getUTCSeconds()}`

    
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





export { insertNota, selectNote, selectNotes, updateDate, deleteDate }