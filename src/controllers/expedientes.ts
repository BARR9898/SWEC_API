import { Request,response,Response } from "express"
import { insertExpedient,deleteExpedient,getExpedient,getExpedients,updateExpedient,selectNextId} from "../services/expedientes";
import { handleHttp } from "../utils/error.handle";
import ExpedienteModel from "../models/expediente";
import { Res } from "../interfaces/response";

const getExpediente = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const response = await getExpedient(id);
        res.send(response);
    } catch (e) {
        res.send({
            result:false,
            data:e
        })
    }

}

const getNextId = async (req: Request,res:Response) => {
    try {
        const response = await selectNextId();
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
        const {query} = req
        const response = await getExpedients(query);
        res.send(response);
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

const postExpediente = async ({body,query} : Request,res:Response) => {
        /*const isValidData = ValidateData(body);
        
        
        if (!isValidData) {
            res.send({
                result:false,
                data: "Información incompleta"
            })
        }*/
        
        const responseItem:Res = await insertExpedient(body,query)
        res.send(responseItem); 

    
}

const deleteExpediente = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem:Res = await deleteExpedient(id);
        res.send(responseItem); 
        
    } catch (e) {
        res.send({
            result:false,
            data:e

        })
    }
}


function ValidateData(data:any){
    try {
        if (!data.paciente.nombre || !data.paciente.nombre || !data.paciente.sexo
            || !data.paciente.apellido_materno || !data.paciente.apellido_paterno
            || !data.paciente.ocupacion || !data.paciente.ingresos_mensuales || !data.paciente.direccion
            || !data.expediente.motivo_de_consulta || !data.expediente.circunstancias_de_aparicion
            || !data.expediente.sintomas || !data.expediente.descripcion_fisica || !data.expediente.demanda_de_tratamiento
            || !data.expediente.area_escolar || !data.expediente.area_laboral
            || !data.expediente.acontecimientos_significativos || !data.expediente.desarrollo_psicosexual
            || !data.expediente.familiograma || !data.expediente.area_de_relacion_y_familiar
            || !data.expediente.mapeo_familiar || !data.expediente.impresion_diagnostica_de_familia
            || !data.expediente.hipotesis_familiar || !data.expediente.examen_mental
            || !data.expediente.indicaciones_diagnosticas || !data.expediente.impresiones_diagnosticas
            || !data.expediente.modalidad_terapeutica || !data.expediente.objetivo_terapeutico 
            || !data.expediente.estrategias_terapeuticas || !data.expediente.pronostico_terapeutico
            || !data.expediente.foco  ) {
            
                return false
        }
        return true
    } catch (error) {
        console.log(error);
        
    }

}



export {getExpediente,getExpedientes,updateExpediente,deleteExpediente,postExpediente,getNextId}