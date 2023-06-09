

import { Query, now } from "mongoose"
import db from "../config/mysql"
import { query } from "express"
import { Request } from "express"
import moment from "moment"
import { Res } from "../interfaces/response"
import { FiltroInterface } from "../interfaces/filtros"
import { existEmail } from "../controllers/auth"

const insertCita = async (cita: any) : Promise<Res> =>  {

    let response:Res = {
        result: false,
        data: []
    }
    try {

        const {estatus,asistencia,id_paciente,fecha} = cita

        const [evaluateIfDateExist]:any = await db.pool.query('SELECT * FROM citas WHERE citas.fecha = ?',[fecha])
        if (evaluateIfDateExist.length != 0) {
    
            response.result = true
            response.data = []
            response.message = "Ya existe una cita registrada para esta fecha"
    
            return response
        }
        
            
        const [result]:any = await db.pool.query('INSERT INTO citas (id,fecha,estatus,asistencia,id_paciente) VALUES (?,?,?,?,?)',
        [null,fecha,estatus,asistencia,id_paciente])    
    
        if(!result.insertId){
            response.result = false
            response.data = []
            response.message = "Cita no registrada"
            return response
    
        }
            
        response.result = true
        response.data = []
        response.message = "Cita registrada con exito"
        return response
        
    } catch (error) {
        response.result = false
        response.data = error
        response.message = "OCURRIO UN ERROR EL REGISTRAR LA CITA"
        return response
    }

    
    
    

}

const selectDates = async (filtros:FiltroInterface) : Promise<Res> =>  { 
        let response: Res  = {
            result:false,
            message:'',
            data: []
        }
        try {

            const [result_select_dates]:any = await db.pool.query(`SELECT citas.id,citas.fecha,citas.estatus,citas.asistencia FROM citas INNER JOIN pacientes on pacientes.id  = citas.id_paciente INNER JOIN usuarios on pacientes.id_usuario = usuarios.id WHERE usuarios.id = ${filtros.id_usuario} ${filtros.fecha_inicio} ${filtros.fecha_fin}`)


            if (result_select_dates.length ==  0) {
                response.data = [],
                response.message = 'El paciente no tiene citas registradas',
                response.result  = true
                return response
            }
        
            response.data = result_select_dates,
            response.message = 'Citas encontradas con exito',
            response.result  = true
            return response

            
        } catch (error) {
            response.data = error,
            response.message = 'Ocurrio un error al obtener las citas',
            response.result  = false
            return response
        }

    

    


    
}

const selectDates_agenda = async (filtros:FiltroInterface) : Promise<Res> => {
 
    let response:Res = {
        result:false,
        data: [],
        message: ''
    }
    try {
        const [result]:any = await db.pool.query(`SELECT e.id as expediente_id,c.*,CONCAT(p.nombre, " ", p.apellido_paterno, " ", p.apellido_materno) as nombre FROM citas c 
        INNER JOIN pacientes p on p.id = c.id_paciente
        INNER JOIN expedientes e on e.id_paciente = p.id
        INNER JOIN usuarios u on u.id = p.id_usuario
        WHERE u.id = ${filtros.id_usuario}
        ${filtros.fecha_inicio}
        ${filtros.fecha_fin}
        ${filtros.asistencia}
        AND c.estatus  = true`)
        console.log('selectDates_agenda - result',result);
    
        if(result.length == 0){
            response.result = false
            response.message  = 'No existen citas que coincidan con la busqueda'
            return response
        }

        response.result = true
        response.message  = 'Citas encontradas'
        response.data  = result
        return response
        
    } catch (error) {
        response.result = false
        response.message  = 'OCURRIO UN  ERROR AL BUSCAR LAS CITAS'
        response.data  = error
        return response
    }
  
}

const selectDate = async (id: any) => {
    let response:Res = {
        result:false,
        data: [],
        message: ''
    }
    try {
        const [result]:any = await db.pool.query('SELECT id,estatus,fecha,asistencia FROM citas WHERE id  = ?',
        [id])
        if (result.length == 0) {
            response.result = false
            response.message = 'Cita no encontrada'
            return response
        }

        response.result = true
        response.message = 'Cita encontrada'
        response.data  =  result
        return response

    } catch (error) {

        response.result = true
        response.message = 'ERROR AL OBTENER LA CITA'
        response.data  =  error
        return response
    }

}

const updateDate = async (id: any, data: any) => {
    let response:Res = {
        result:false,
        data: [],
        message:''
    }
    try {
        const {estatus,asistencia,fecha} =  data
        const [result]:any = await db.pool.query(`UPDATE citas SET fecha = ?, asistencia = ?, estatus = ? WHERE citas.id = ?`,[fecha,asistencia,estatus,id])    
        if (result.changedRows == 0) {
            response.result = false
            response.message  = 'No se actualizo la cita' 
            return response
        }

        response.result = true
        response.message  = 'Cita actualizada' 
        return response
    } catch (error) {
        response.result = false
        response.message  = 'ERROR AL ACTUALIZAR LA CITA' 
        response.data = error
        return response
        
        
    }

}

const deleteDate = async (id: any) : Promise<Res> => {

    let  response:Res = {
        result: false,
        data: []
    }

    try {
    
        const [result]:any = await db.pool.query('DELETE FROM citas WHERE id = ?',
        [id])

        console.log('result',result);
        
        
        if (!result.affectedRows) {
            response.result = false,
            response.message =  'No se pudo eliminar la cita'
            return response
        }

        response.result = true,
        response.message =  'Ciita eliminada con exiito'
        return response

    } catch (error) {
        response.result = false,
        response.message =  'Ocurrio un error al elimnar la cita'
        return response
        
    }    
}





export { insertCita, selectDate, selectDates, updateDate, deleteDate , selectDates_agenda}