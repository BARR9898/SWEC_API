import { Request,response,Response } from "express"
import { insertExpedient,deleteExpedient,getExpedient,getExpedients,selectNextId} from "../services/expedientes";
import { handleHttp } from "../utils/error.handle";
import { Res } from "../interfaces/response";
import { FiltroInterface } from "../interfaces/filtros";
import { handleError } from "../middleware/handleError";

const getExpediente = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await getExpedient(id);
        if (!responseItem) {
            res.send({
                result:false,
                message:'El expediente no fue encontrado',
                data: []
            })
        }
        res.send(responseItem);
    } catch (e) {
        handleError('ERROR AL TRATAR DE OBTENER EL EXPEDIENTE')
    }

}

const getNextId = async (req: Request,res:Response) => {
    try {
        const response = await selectNextId();
        res.send(response);
    } catch (e) {
        handleError('ERROR AL TRATAR DE OBTENER EL PROXIMO ID')
    }

}

const getExpedientes = async (req:Request,res:Response) => {
    try {
        const {query} = req
        let filtros:FiltroInterface  =  createFilters(query)        
        const response = await getExpedients(filtros);
        res.send(response);
    } catch (e) {
        handleError('ERROR AL OBETNER LOS EXPEDIENTES',res)
    }
}

const postExpediente = async ({body,query} : Request,res:Response) => {  
        let filtros = createFilters(query)      
        const responseItem:Res = await insertExpedient(body,filtros)
        res.send(responseItem); 
}

const deleteExpediente = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem:Res = await deleteExpedient(id);
        res.send(responseItem); 
        
    } catch (e) {
        handleError('ERROR AL ELIMINAR EL EXPEDEINTE',res)
    }
}

function createFilters(query:any) :  FiltroInterface{

    let filtros:FiltroInterface = {
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_inicio: '',
        fecha_fin: '',
        estatus: '',
        id_usuario: query.id_usuario
    }

    switch (query.nombre) {
        case '':
            filtros.nombre = ''
            break;
    
        default:
            filtros.nombre = `AND p.nombre = '${query.nombre}' `
            break;
    }

    switch (query.apellido_materno) {
        case '':
            filtros.apellido_materno = ''
            break;
    
        default:
            filtros.nombre = `AND p.apellido_materno = '${query.apellido_materno}' `
            break;
    }

    switch (query.apellido_paterno) {
        case '':
            filtros.apellido_paterno = ''
            break;
    
        default:
            filtros.nombre = `AND p.apellido_paterno = '${query.apellido_paterno}' `
            break;
    }

    return filtros
    
}





export {getExpediente,getExpedientes,deleteExpediente,postExpediente,getNextId}