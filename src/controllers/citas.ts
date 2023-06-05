import { Request,response,Response } from "express"
import { insertCita,selectDates,selectDate, updateDate, deleteDate , selectDates_agenda} from "../services/citas";
import { handleHttp } from "../utils/error.handle";
import ExpedienteModel from "../models/expediente";
import { Res } from "../interfaces/response";

const postCita = async ({body} : Request,res:Response) => {
    /*const isValidData = ValidateData(body);
    if (!isValidData) {
        res.send({
            result:false,
            data: "Información incompleta"
        })
    }*/

    const responseItem:Res = await insertCita(body);
    res.send(responseItem); 


}


const deleteCita = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await deleteDate(id);
        res.send(responseItem); 
        
    } catch (e) {
        res.send({
            result:false,
            data:e

        })
    }
}

const getAllCitas = async ({params,query,body}: Request,res:Response) => {
    try {
        
        
        const {id} = params;
        const {user_id} = body
        
       const response = await selectDates(id,query,user_id);
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

const getAllCitas_agenda = async ({query}: Request,res:Response) => {
    try {
               
        let user_id = '1'
       const response = await selectDates_agenda(user_id,query);
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

const getCita = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const response = await selectDate(id);
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

}
export {postCita,getAllCitas,getCita,updateCita,deleteCita,getAllCitas_agenda}