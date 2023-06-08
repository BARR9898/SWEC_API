import { Expediente } from "../interfaces/expediente.interface"
import db, { pool } from "../config/mysql"
import moment from "moment"
import { Res } from "../interfaces/response"
import { FiltroInterface } from "../interfaces/filtros"
import { insertPaciente } from "./pacientes"
import { Result } from "express-validator"

const insertExpedient = async (data: Expediente,filtros:FiltroInterface) : Promise<Res> => {

    let response:Res = {
        result: false,
        data: []
    }

    const { paciente, expediente } = data
    let id_usuario = parseInt(filtros.id_usuario!)
    
    const insert_paciente_result:Res = await insertPaciente(paciente,id_usuario);
    if (!insert_paciente_result.result) {
        return insert_paciente_result
    }

    let id_paciente = insert_paciente_result.data
    const resInsertIntoExpedientes:Res = await insertIntoExpedientes(expediente,id_paciente)
    let id_expedient = resInsertIntoExpedientes.data
    insertExpedientSintomas(id_expedient,expediente.sintomas)
    insertExpedientImpresionesDiagnosticas(id_expedient,expediente.impresiones_diagnosticas)
    insertExpedientModalidadTerapeutica(id_expedient,expediente.modalidad_terapeutica)

    const expedientCreated:any = await getExpedient(id_expedient)
    
   if(!expedientCreated){
    response.data = []
    response.message = "Error al obtener el expediente creado"
    response.result = true
    return response
   }

    response.data = expedientCreated
    response.result = true
    response.message =  "Expediente  creado con exito"
    return response

}

const getExpedients = async (filtros:FiltroInterface) : Promise<Res> => {
    let response:Res = {
        result: false,
        data: [],
        message:  ''
    }

    const responseItem = await getAllExpedients(filtros); 
    if(responseItem.length == 0) {
        response.data = [],
        response.message = 'No existen expedientes registrados',
        response.result= false
        return response
    }

    response.data = responseItem,
    response.result= true
    return response
}

const deleteExpedient = async (id: any) : Promise<Res>  => {
    let response:Res = {    
        result: false,
        data: [],
        message: ''

    }
    try {

    
        //Delete from sintomas
        await DeleteSintomas(id)
    
        //Delte from modalidades tereapeuticas
        await DeleteModalidaesTerapeuticas(id)
    
        //Delete from impresiones diagnosticas
        await DeleteImpresionesDiagnosticas(id)
    
        //Delete from expedientes
        await DeleteExpediente(id)
        
        response.data = [],
        response.message =  'Expediente eliminado correctamente'
        response.result = true
        return response;
        
    } catch (error) {
        console.log('ERROR AL ELIMINAR EL EXPDIENTE',error);
        response.message =  'Ocurrio un error al elimnar el expediente',
        response.result = false
        return response
    }
    
}


async function insertIntoExpedientes(expediente: any,id_paciente:number) : Promise<Res> {


    let response:Res  = {
        result: false,
        data: []
    }



    try {

        const {motivo_de_consulta,circunstancias_de_aparicion,descripcion_fisica,demanda_de_tratamiento
            ,area_escolar,area_laboral,acontecimientos_significativos,desarrollo_psicosexual,
            objetivo_terapeutico,estrategia_terapeutica,
            pronostico_terapeutico,familiograma,area_de_relacion_y_familiar,
            mapeo_familiar,impresion_diagnostica_de_familia,hipotesis_familiar,
            examen_mental,indicaciones_diagnosticas,foco_terapeutico,m
            } = expediente
    
            const  [result_insert_into_expedientes]:any = await pool.query('INSERT INTO expedientes (id, circunstancias_aparicion, descripcion_fisica, demanda_tratamiento, area_escolar, area_laboral, acontecimientos_significativos,desarrollo_psicosexual, foco_terapeutico, objetivo_terapeutico, estrategia_terapeutica, pronostico_terapeutico, familiograma, area_familiar_relacion, mapeo_familiar, impresiones_diagnosticas_familia, hipotesis_familiar, examen_mental, indicaciones_diagnosticas, motivo_consulta, fecha_creacion, id_paciente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)' ,[null,circunstancias_de_aparicion,descripcion_fisica,demanda_de_tratamiento,area_escolar,area_laboral,acontecimientos_significativos,desarrollo_psicosexual,foco_terapeutico,objetivo_terapeutico,estrategia_terapeutica,pronostico_terapeutico,
            familiograma,area_de_relacion_y_familiar,
            mapeo_familiar,impresion_diagnostica_de_familia,
            hipotesis_familiar,examen_mental,indicaciones_diagnosticas,motivo_de_consulta,moment(new Date()).format('YYYY-MM-DD h:mm:ss'),id_paciente] )        
            
            if (!result_insert_into_expedientes.insertId) {
                response.result =  false
                response.message = 'Error al insterar  la informacion del expediente'
                response.data = []
                return response
            }
            
            response.result = true,
            response.data  = result_insert_into_expedientes.insertId 
            return response

    } catch (error) {
        console.log('ERROR  AL CREAR EL EXPEDIENTE',error);
        response.result = false,
        response.data  =  error
        response.message  =  'ERROR  AL CREAR EL EXPEDIENTE'
        return response
    }

    

}

async function insertExpedientSintomas(id_expediente: number,values: any[]) {
    values.forEach(async (value, index) => {
        const [rows]: any = await db.pool.query(`INSERT INTO sintomas (id,sintoma,id_expediente) VALUES (?,?,?)`, [null, value,id_expediente])
    })
}

async function insertExpedientImpresionesDiagnosticas(id_expediente: number,values: any[]) {

        values.forEach(async (value, index) => {
            let valuesAux: any = [];
            value.forEach((data: any) => {
                valuesAux.push(data)
            })
            const [rows]: any = await db.pool.query(`INSERT INTO impresiones_diagnosticas (id,eje,dcm,cie,transtorno,id_expediente) VALUES (?,?,?)`, [null, valuesAux,id_expediente])

        })


}

async function insertExpedientModalidadTerapeutica(id_expedient: number, values: any[]) {    
    values.forEach(async (value, index) => {
        const [rows]: any = await db.pool.query(`INSERT INTO modalidades_terapeuticas (id,ti,tf,tp,tg,otra,fundamento,id_expediente) VALUES (?,?,?)`, [null,value,id_expedient])
    })
}

async function getExpedient(idExpediente: any){

    
    try {
        let expedient_data:Expediente = {
            paciente:{
                nombre:'',
                edad:'',
                sexo:'M',
                apellido_paterno:'',
                apellido_materno:'',
                ocupacion: '',
                ingresos_mensuales: '',
                direccion: ''
        
            },
            expediente:{
                motivo_de_consulta:'',
                circunstancias_de_aparicion:'',
                sintomas:[],
                descripcion_fisica:'',
                demanda_de_tratamiento:'',
                area_escolar:'',
                area_laboral:'',
                acontecimientos_significativos:'',
                desarrollo_psicosexual:'',
                familiograma:'',
                area_de_relacion_y_familiar:'',
                mapeo_familiar:'',
                impresion_diagnostica_de_familia:'',
                hipotesis_familiar: '',
                examen_mental:'',
                indicaciones_diagnosticas:'',
                impresiones_diagnosticas:[],
                modalidad_terapeutica: [],
                objetivo_terapeutico: '',
                estrategias_terapeuticas: [{}],
                pronostico_terapeutico: '',
                foco:''
            }
        };


        //Obtenemos la información del expediente
        const [expediente]: any = await db.pool.query(`SELECT expedientes.circunstancias_aparicion,expedientes.descripcion_fisica,expedientes.demanda_tratamiento,
        expedientes.area_escolar,expedientes.area_laboral,expedientes.acontecimientos_significativos,
        expedientes.desarrollo_psicosexual,expedientes.foco_terapeutico,expedientes.objetivo_terapeutico,
        expedientes.estrategia_terapeutica,expedientes.pronostico_terapeutico,expedientes.familiograma,
        expedientes.area_familiar_relacion,expedientes.mapeo_familiar,expedientes.impresiones_diagnosticas_familia,
        expedientes.hipotesis_familiar,expedientes.examen_mental,expedientes.indicaciones_diagnosticas,
        expedientes.motivo_consulta, expedientes.fecha_creacion,expedientes.id
        FROM expedientes 
        WHERE expedientes.id = ${idExpediente}`)
        expedient_data.expediente = expediente[0]

        if(expediente.length == 0){
            return false
        }
    
    
        
        const [paciente]: any = await db.pool.query(`SELECT p.id,p.nombre,p.apellido_materno,p.apellido_paterno,p.direccion,p.ingresos_mensuales,p.sexo,p.ocupacion,p.edad
        FROM pacientes p
        INNER JOIN expedientes on expedientes.id_paciente = p.id
        WHERE expedientes.id= ${idExpediente}`)
    
        expedient_data.paciente = paciente[0]
    
        //Obtenemos los sintomas
        const sintomas = await getSintomas(idExpediente)
        expedient_data.expediente.sintomas = sintomas;
    
        //Obtenemos la modalidad terapeutica
        const modalidades_terapeuticas = await getModalidadTerapeutica(idExpediente)
        expedient_data.expediente.modalidad_terapeutica = modalidades_terapeuticas;
    
        //Obtenemos las impresiones diagnosticas
        const impresiones_diagnosticas = await getImpresionesDiagnosticas(idExpediente)
        expedient_data.expediente.impresiones_diagnosticas = impresiones_diagnosticas;
        
        return [expedient_data]
       
    } catch (error) {
        console.log('OCURRIO  UN ERROR AL TRATAR DE OBTENR EL EXPEDIENTE BUSCADO',error);
    }





}

async function getSintomas(expedienteId: number) {
    const query = `SELECT sintoma FROM sintomas
    WHERE sintomas.id_expediente = ${expedienteId}`
    const [rows]: any = await db.pool.query(query)

    //Asignamos los sintomas a un array y retornarmos el arrya con los sintomas
    let sintomas: any = []
    rows.forEach((sintoma: any) => {
        sintomas.push(sintoma.sintoma)
    })
    return sintomas
}

async function getModalidadTerapeutica(expedienteId: number) {
    const query = `SELECT ti,tf,tp,tg,otra,fundamento FROM modalidades_terapeuticas
    WHERE modalidades_terapeuticas.id_expediente = ${expedienteId}`
    const [rows]: any = await db.pool.query(query)


    //Asignamos los sintomas a un array y retornarmos el arrya con los sintomas
    let modalidades_terapeuticas = rows
    return modalidades_terapeuticas

}

async function getImpresionesDiagnosticas(expedienteId: number) {
    const query = `SELECT eje,dcm,cie,transtorno FROM impresiones_diagnosticas
    WHERE impresiones_diagnosticas.id_expediente = ${expedienteId}`
    const [rows]: any = await db.pool.query(query)

    //Asignamos las impresiones_diagnosticas a un array y retornarmos el arrya con las impresiones_diagnosticas
    let modalidades_terapeuticas: any = rows
    return modalidades_terapeuticas

}

//DELETE METHODS
async function DeleteSintomas(expedienteId: number) {
    const [rows]: any = await db.pool.query(`DELETE FROM sintomas WHERE id_expediente = ${expedienteId}`)
}

async function DeleteModalidaesTerapeuticas(expedienteId: number) {
    const [rows]: any = await db.pool.query(`DELETE FROM modalidades_terapeuticas WHERE id_expediente = ${expedienteId}`)
}

async function DeleteImpresionesDiagnosticas(expedienteId: number) {
    const [rows]: any = await db.pool.query(`DELETE FROM impresiones_diagnosticas WHERE id_expediente = ${expedienteId}`)
}

async function DeleteExpediente(expedienteId: number) {    
    const [select_id_paciente]: any = await db.pool.query(`SELECT id_paciente  FROM expedientes WHERE id = ${expedienteId}`)
    if(select_id_paciente.length == 0){
        return
    }
    const [rows]: any = await db.pool.query(`DELETE  FROM expedientes WHERE id = ${expedienteId}`)
    const [delete_paciente]: any = await db.pool.query(`DELETE  FROM pacientes WHERE id = ${select_id_paciente[0].id_paciente}`)
}

//GET EXPEDIENTS 
async function getAllExpedients(filtros:FiltroInterface){
    const [rows]:any = await db.pool.query(`SELECT expedientes.id,expedientes.fecha_creacion, p.nombre, p.apellido_paterno, p.apellido_materno FROM pacientes p 
    INNER JOIN expedientes on expedientes.id_paciente = p.id
    WHERE p.id_usuario = ${filtros.id_usuario}
    ${filtros.nombre}
    ${filtros.apellido_materno}
    ${filtros.apellido_paterno}`)    
    return rows
   
}

const selectNextId = async () : Promise<Res> => {
    let response:Res = {
        result:false,
        data: []
    }

    try {
        const [result]:any = await db.pool.query("SELECT id FROM expedientes ORDER BY  id DESC LIMIT 1")   
        if (result.length == 0) {
            response.result = false,
            response.message  =  'No existen expedientes registrados',
            response.data =  []
            return response
        }

        response.result = true,
        response.message  =  'Proximo ID obtenido con exito',
        response.data = result[0].id
        return response


    } catch (error) {
        
        response.result = false,
        response.message  =  'Ocurrio un error al  tratar de obtener el proximo id',
        response.data = error
        return response
    }



} 

export { insertExpedient, getExpedient, getExpedients, deleteExpedient,selectNextId }