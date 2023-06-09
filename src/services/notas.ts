

import { Query, now } from "mongoose"
import db from "../config/mysql"
import { query } from "express"
import moment from "moment"
import { Res } from "../interfaces/response"
import { FiltroInterface } from "../interfaces/filtros"

const insertNota = async (data: any) => {
    let response:Res = {
        result:false,
        data: [],
    }

try {

    const {fecha,nota,id_expediente} = data
    const [result]:any = await db.pool.query('INSERT INTO notas_clinicas (id,fecha,nota,id_expediente) VALUES (?,?,?,?)',
    [null,fecha,nota,id_expediente])

    if(!result.insertId){
        response.result =  false
        response.message = 'La nota no fue creada'
        return response
    }

    response.result =  true
    response.message = 'Nota creada'
    return response

} catch (error) {
    response.result =  false
    response.message = 'ERRROR AL CREAR LA NOTA'
    response.data =  error
    return response
}

    
    
    

}

const selectNotes = async (id_expediente:any,filtros:FiltroInterface) : Promise<Res> => {
    let response:Res = {
        result:false,
        message:'',
        data: []
    }
        try {
            const [result]:any = await db.pool.query(`SELECT n.nota,n.id,n.fecha FROM notas_clinicas n INNER JOIN expedientes e on e.id = n.id_expediente INNER JOIN pacientes p  on p.id  = e.id_paciente WHERE e.id = ${id_expediente} ${filtros.fecha_inicio} ${filtros.fecha_fin}`)

            if (result.length  ==  0) {
                response.result = false,
                response.message = 'No se encontraron las notas del expedeinte',
                response.data  =  []
                return response
            }
            response.result = true,
            response.message = 'Notas encontradas',
            response.data  =  result
            return response
        } catch (error) {
            response.result = false,
            response.message = 'OCURRIO UN ERROR AL OBTENER LAS NOTAS',
            response.data  =  error
            return response
        }

}

const selectNote = async (id: any) : Promise<Res> => {
    let response:Res = {
        result:false,
        message:'',
        data: []
    }
    try {
        const [result]:any = await db.pool.query('SELECT n.id,n.nota,n.fecha FROM notas_clinicas n WHERE n.id  = ?',
        [id])

        
        if (result.length ==  0) {
            response.result = false,
            response.message = 'No se encontro la nota',
            response.data  =  []
            return response
        }
        response.result = true,
        response.message = 'Se encontro la nota',
        response.data  =  result
        return response
        
    } catch (error) {
        response.result = false,
        response.message = 'Ocurrio un error al obtener la nota',
        response.data  =  error
        return response
    }
}





export { insertNota, selectNote, selectNotes }