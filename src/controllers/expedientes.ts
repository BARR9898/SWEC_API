import { Request,response,Response } from "express"
import { insertExpedient,deleteExpedient,getExpedient,getExpedients,updateExpedient} from "../services/expedientes";
import { handleHttp } from "../utils/error.handle";

const getExpediente = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const response = await getExpedient(id);
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

const getExpedientes = async (req:Request,res:Response) => {
    try {
        const response = await getExpedients();
        res.send({
            result:true,
            data:response,
            status:200
        });
    } catch (e) {
        res.send({
            result:false,
            data:e
        })
    }
}

const updateExpediente = async ( {params,body} :Request,res:Response) => {
    try {
        const {id} = params;
        const response = await updateExpedient(id,body);
        res.send({
            result:true,
            data:response,
            status: 200
        });
    } catch (e) {
        res.send({
            result:true,
            data: e
        })
    }
}

const postExpediente = async ({body} : Request,res:Response) => {
    try {
        const responseItem = await insertExpedient(body);

        res.send({
            result: true,
            data:responseItem,
            status: 200
        }); 

    } catch (e) {
        res.send({
            result: false,
            data: e
        })
    }
}

const deleteExpediente = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await deleteExpedient(id);
        res.send({
            result:true,
            data:responseItem,
            stauts:200
        }); 
    } catch (e) {
        res.send({
            result:false,
            data:e

        })
    }
}

export {getExpediente,getExpedientes,updateExpediente,deleteExpediente,postExpediente}