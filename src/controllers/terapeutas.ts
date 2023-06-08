import { Request,response,Response } from "express"
import { insertTerapeuta,selectTerapeutas,deleteTerapeut,selectTerapeuta,updateTerapeuta} from "../services/terapeutas";

const postTerapeuta = async ({body} : Request,res:Response) => {
    /*const isValidData = ValidateData(body);
    if (!isValidData) {
        res.send({
            result:false,
            data: "Información incompleta"
        })
    }*/

    const responseItem = await insertTerapeuta(body);
    switch (responseItem) {
        case 'SOLO PUEDE EXISTIR UN TERAPEUTA':
            res.send({
                result: false,
                message:'Solo puede existir un terapeuta.',
                
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

const putTerapeuta = async ({body} : Request,res:Response) => {
    /*const isValidData = ValidateData(body);
    if (!isValidData) {
        res.send({
            result:false,
            data: "Información incompleta"
        })
    }*/

    const responseItem = await updateTerapeuta(body);
    switch (responseItem) {
        case true:
            res.send({
                result: true,
                data:responseItem,
                status: 200
            }); 
            break;
        case false:
            res.send({
                result: false
            }); 
            break;
        default:
            break;
    }
}


const deleteTerapeuta = async ({params} : Request,res:Response) => {
    try {
        const {id} = params;
        const responseItem = await deleteTerapeut(id);
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

const getAllTerapeutas = async ({params,query}: Request,res:Response) => {
    try {
       const response = await selectTerapeutas();
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


const getTerapeuta = async ({params,query}: Request,res:Response) => {
    try {
        const {id}  = params
       const response = await selectTerapeuta(id);
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

export {postTerapeuta,getAllTerapeutas,deleteTerapeuta,getTerapeuta,putTerapeuta}