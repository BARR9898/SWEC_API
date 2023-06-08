import { Request,response,Response } from "express"
import { insertUsuario,selectUsuarios,deleteUsuario,selectUsuario} from "../services/usuarios";

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

const removeUsuario = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await deleteUsuario(id);
        if(responseItem){
            res.send({
                result:true,
                data:responseItem,
                stauts:200
            });
        }else{
            res.send({
                result:false
            }); 
        }

        
    } catch (e) {
        res.send({
            result:false,
            data:e

        })
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

export {postUsuario,getAllUsuarios,removeUsuario,getUsuario}