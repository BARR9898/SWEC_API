import { Request,response,Response } from "express"
import { insertNota,selectNotes,selectNote, updateDate, deleteDate} from "../services/notas";
import { handleHttp } from "../utils/error.handle";
import ExpedienteModel from "../models/expediente";


const postNota = async ({body} : Request,res:Response) => {
    /*const isValidData = ValidateData(body);
    if (!isValidData) {
        res.send({
            result:false,
            data: "Información incompleta"
        })
    }*/

    const responseItem = await insertNota(body);
    res.send({
        result: true,
        data:responseItem,
        status: 200
    }); 


}


const deleteCita = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await deleteDate(id);
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

const getAllNotas = async ({params,query}: Request,res:Response) => {
    try {
        
        
        const {id} = params;
       const response = await selectNotes(id,query);
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

const getNote = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const response = await selectNote(id);
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
export {postNota,getAllNotas,getNote,updateCita,deleteCita}