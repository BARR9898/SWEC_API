import { Request,response,Response } from "express"
import { insertNota,selectNotes,selectNote} from "../services/notas";
import { Res } from "../interfaces/response";
import { handleError } from "../middleware/handleError";
import { FiltroInterface } from "../interfaces/filtros";


const postNota = async ({body} : Request,res:Response) => {
    try {
        const responseItem = await insertNota(body);
        res.send(responseItem)
    } catch (error) {
        handleError('ERROR  AL  TRATAR  DE CREAR LA NOTA')
    }


}

const getAllNotas = async ({params,query}: Request,res:Response) => {
    try { 
        const {id} = params;
        const filtros:FiltroInterface = crearFiltrosCitas(query)
        const responseItem:Res = await selectNotes(id,filtros);
        res.send(responseItem)
    } catch (e) {
        handleError('OCURRIO UN ERROR AL TRATAR DE OBTENER LAS NOTAS DEL EXPEDIENTE')
    }

}

const getNote = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem:Res = await selectNote(id);
        res.send(responseItem)
    } catch (e) {
        handleError('EEROR AL TRATARDE OBTENER LA NOTA')
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
            filtros.fecha_inicio  = `AND n.fecha >= '${query.fecha_inicio}'`
            break;
    }


    switch (query.fecha_fin) {
        case '':
            filtros.fecha_fin  = ''
            break;
        default:
            filtros.fecha_fin  = `AND n.fecha <= '${query.fecha_fin}'`
            break;
    }

    return filtros


}
export {postNota,getAllNotas,getNote}