import { Request,response,Response } from "express"
import { insertCita,selectDates,selectDate, updateDate, deleteDate , selectDates_agenda} from "../services/citas";
import { handleHttp } from "../utils/error.handle";
import ExpedienteModel from "../models/expediente";

const postCita = async ({body} : Request,res:Response) => {
    /*const isValidData = ValidateData(body);
    if (!isValidData) {
        res.send({
            result:false,
            data: "Información incompleta"
        })
    }*/

    const responseItem = await insertCita(body);
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

const getAllCitas = async ({params,query}: Request,res:Response) => {
    try {
        
        
        const {id} = params;
        
       const response = await selectDates(id,query);
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
                
       const response = await selectDates_agenda(query);
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