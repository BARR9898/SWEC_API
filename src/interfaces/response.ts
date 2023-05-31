import { Expediente } from "./expediente.interface"

export interface Res{
    result: boolean
    data:Array<any>[] | Expediente ,
    message?: string

}