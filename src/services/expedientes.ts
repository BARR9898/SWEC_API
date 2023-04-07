import { Expediente } from "../interfaces/expediente.interface"
import  ExpedienteModel from "../models/expediente"

const insertExpedient = async (item:Expediente) => {
    console.log(item)
    const responseInsert = await ExpedienteModel.create(item);
    return responseInsert;

}

const getExpedients = async () => {
    const responseItem = await ExpedienteModel.find({});
    return responseItem;
}

const getExpedient = async (id:string) => {
    const responseItem = await ExpedienteModel.findOne({_id: id});
    return responseItem;
}

const updateExpedient = async (id:string,data:Expediente) => {
    const responseItem = await ExpedienteModel.findOneAndUpdate({_id: id},data,{new:true});
    return responseItem;
}

const deleteExpedient = async (id:string) => {
    const responseItem = await ExpedienteModel.deleteOne({_id: id});
    return responseItem;
}

export {insertExpedient,getExpedient,getExpedients,updateExpedient,deleteExpedient}