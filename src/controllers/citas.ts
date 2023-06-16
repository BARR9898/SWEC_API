import { Request,response,Response } from "express"
import { insertCita,selectDates,selectDate, updateDate, deleteDate , selectDates_agenda} from "../services/citas";
import { Res } from "../interfaces/response";
import { FiltroInterface } from "../interfaces/filtros";
import { handleError } from "../middleware/handleError";

const postCita = async ({body} : Request,res:Response) => {
    const responseItem:Res = await insertCita(body);
    res.send(responseItem); 
}

const getAllCitas = async ({query}: Request,res:Response) => {
    try {
        const filtros:FiltroInterface = crearFiltrosCitas(query)   
        const responseItem = await selectDates(filtros);
        res.send(responseItem)
    } catch (e) {
        handleError('Ocurrio un  error al tratar de obtener las citas del paciente')
    }

}

const getAllCitas_agenda = async ({query}: Request,res:Response) => {
    try {      
        const filtros:FiltroInterface = crearFiltrosCitas(query)
        const responseItem = await selectDates_agenda(filtros);
        res.send(responseItem)
    } catch (e) {
        handleError('OCURRIO UN ERROR AL TRATAR DE OBTENER LAS CITAS DE LA AGENDA')
    }

}

const deleteCita = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await deleteDate(id);
        res.send(responseItem); 
        
    } catch (e) {
        handleError('OCURRIO UN ERROR AL TRATAR DE ELIMINAR LA CITA')
    }
}

const getCita = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await selectDate(id);
        res.send(responseItem);
    } catch (e) {
        handleError('ERROR AL TRATAR DE OBTENER LA CITA')
    }

}

const updateCita = async ({params,body} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await updateDate(id,body);
        res.send(responseItem)
    } catch (e) {
        handleError('ERROR AL TRATAR DE ACTUALIZAR LA CITA')
    }

}


function crearFiltrosCitas(query:any) : FiltroInterface {

    let filtros : FiltroInterface  = {
      nombre: '' ,
      apellido_materno:  '',
      apellido_paterno: '',
      estatus: '',
      fecha_inicio: '',
      fecha_fin: '',
      asistencia: '',
      id_usuario: query.id_usuario
    }

    switch (query.fecha_inicio) {
        case '':
            filtros.fecha_inicio  = ''
            break;
        default:
            filtros.fecha_inicio  = `AND c.fecha >= '${query.fecha_inicio}'`
            break;
    }


    switch (query.fecha_fin) {
        case '':
            filtros.fecha_fin  = ''
            break;
        default:
            filtros.fecha_fin  = `AND c.fecha <= '${query.fecha_fin}'`
            break;
    }

    switch (query.asistencia) {
        case 'pendientes':
            filtros.asistencia  = 'AND c.asistencia =  -1'
            break;
        case 'con asistencia':
            filtros.asistencia  = 'AND c.asistencia =  1'
            break;
        case 'sin asistencia':
            filtros.asistencia  = 'AND c.asistencia =  0'
            break;
        default:
            filtros.asistencia  = ''
            break;
    }




    return filtros


}

export {postCita,getAllCitas,getCita,updateCita,deleteCita,getAllCitas_agenda}