import { Request,response,Response } from "express"
import { insertUsuario,selectUsuarios,deleteUsuario,selectUsuario,updateUser} from "../services/usuarios";
import { handleError } from "../middleware/handleError";

const postUsuario = async ({body} : Request,res:Response) => {
    /*const isValidData = ValidateData(body);
    if (!isValidData) {
        res.send({
            result:false,
            data: "Información incompleta"
        })
    }*/

    const responseItem = await insertUsuario(body);
    switch (responseItem) {
        case 'ALREADY_USER':
            res.send({
                result: false,
                message:'El  usuario ya existe',
                
            }); 
            break;
        case null:
            res.send({
                result: false
            }); 
            break;
        default:
            res.send({
                result: true,
                data:responseItem,
                status: 200
            }); 
            break;
    }
}

const updateUsuario = async ({body,params} : Request,res:Response) => {
    try {
        const {id} = params
        const responseItem = await updateUser(body,id);
        res.send(responseItem) 
    } catch (error) {
        handleError(`ERROR AL ACTUALIZAR EL USUARIO - ${error}`)
    }

}

const removeUsuario = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await deleteUsuario(id);
        res.send(responseItem)
    } catch (e) {
        handleError(`ERROR AL TRATAR DE ELIMINAR EL USUARIO - ${e}`)
    }
}

const getAllUsuarios = async ({params,query}: Request,res:Response) => {
    try {
       const response = await selectUsuarios();
        const data = response ? response: "NOT_FOUND"
        res.send({
            result:true,
            data:data,
            status:200
        });
    } catch (e) {
        res.send({
            result:false,
            data:e
        })
    }

}


const getUsuario = async ({params,query}: Request,res:Response) => {
    try {
        const {id}  = params
       const response = await selectUsuario(id);
        const data = response ? response: "NOT_FOUND"
        res.send({
            result:true,
            data:data,
            status:200
        });
    } catch (e) {
        res.send({
            result:false,
            data:e
        })
    }

}

/*
const updateCita = async ({params,body} : Request,res:Response) => {
    try {
        const {id} = params;
     
        
        const response = await updateDate(id,body);
        const data = response ? response: "NOT_FOUND"
        res.send({
            result:true,
            data:data,
            status:200
        });
    } catch (e) {
        res.send({
            result:false,
            data:e
        })
    }

}*/

export {postUsuario,getAllUsuarios,removeUsuario,getUsuario,updateUsuario}