import { Expediente } from "../interfaces/expediente.interface"
import ExpedienteModel from "../models/expediente"
import db from "../config/mysql"
import moment from "moment"
import { Res } from "../interfaces/response"

const insertExpedient = async (item: Expediente,params:any) : Promise<Res> => {

    let response:Res = {
        result: false,
        data: []
    }

    const { paciente, expediente } = item
    let {user_id} = params
    user_id =  parseInt(user_id)
    
    const idPatientCreated = await createPatient(paciente,user_id);
    if (!idPatientCreated) {
        response.data = []
        response.message = "Error al crear el paciente"
        response.result = true
        return response
    }

    const expedientCreatedSuccessfuly = await createExpedient(user_id,idPatientCreated, expediente)
   if(!expedientCreatedSuccessfuly){
    response.data = []
    response.message = "Error al crear el expediente"
    response.result = true
    return response
   }

    response.data = expedientCreatedSuccessfuly
    response.result = true
    response.message =  "Expediente  creado con exito"
    return response

}

const getExpedients = async (query:any) : Promise<Res> => {
    let response:Res = {
        result: false,
        data: [],
        message:  ''
    }

    let filtros = getAllExpedientsCreateFilters(query)
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

const getExpedient = async (id: any) : Promise<Res> => {
    let response:Res = {
        result: false,
        data:  []
    }
    const responseItem:Expediente = await getExpedientCreated(id)
    response.result = true,
    response.data = responseItem
    return response;
}

const updateExpedient = async (id: any, data: Expediente) => {

    const {expediente,paciente} = data
    await updatePaciente(id,paciente)
    await updateSintomas(id,expediente.sintomas)
  
    
    
    
}

const deleteExpedient = async (id: any) : Promise<Res>  => {

    let response:Res = {    
        result: false,
        data: [],
        message: ''

    }

    //Delete from sintomas
    await DeleteSintomas(id)

    //Delte from modalidades tereapeuticas
    await DeleteModalidaesTerapeuticas(id)

    //Delete from impresiones diagnosticas
    await DeleteImpresionesDiagnosticas(id)

    //Delete from expedientes_pacientes
    await DeleteExpedientes_Pacientes(id)
    
    response.data = [],
    response.message =  'Expediente eliminado correctamente'
    response.result = true
    return response;
    
}

//Metodos para agregar data a la BDD

async function createPatient(patient: any,user_id:any) {
    const { nombre, apellido_materno, apellido_paterno, edad, sexo, direccion, ingresos_mensuales, ocupacion } = patient
    const [rows]: any = await db.pool.query("INSERT INTO pacientes (id,nombre,apellido_materno,apellido_paterno,edad,sexo,direccion,ingresos_mensuales,ocupacion) VALUES (?,?,?,?,?,?,?,?,?)",
        [null, nombre, apellido_materno, apellido_paterno, edad, sexo, direccion, ingresos_mensuales, ocupacion])
    if (rows.affectedRows) {
        const patientId = rows.insertId;
        const relationedSuccessfuly = await insertIntoPatientTerapeut(patientId, user_id)
        if (!relationedSuccessfuly) {
            return
        }
        return rows.insertId
    } else {
        return false
    }

}

async function insertIntoPatientTerapeut(id_patient: number, id_terapeut: number) {
    const [rows]: any = await db.pool.query("INSERT INTO usuarios_terapeutas (id,id_paciente,id_terapeuta) VALUES (?,?,?)", [null, id_patient, id_terapeut])
    if (rows.affectedRows) {
        return true
    }
    return false
}

async function createExpedient(user_id:string,idPatientCreated: number, expediente: any) {

    
    const {motivo_de_consulta,circunstancias_aparicion,descripcion_fisica,sintomas,demanda_tratamiento
    ,area_escolar,area_laboral,acontecimientos_significativos,desarrollo_psicosexual,
    objetivo_terapeutico,estrategia_terapeutica,
    pronostico_terapeutico,familiograma,area_familiar_relacion,
    mapeo_familiar,impresiones_diagnosticas_familia,hipotesis_familiar,
    examen_mental,indicaciones_diagnosticas,foco_terapeutico,
    impresiones_diagnosticas,
    modalidad_terapeutica} = expediente
    
    
    const IdExpedientCreated = await InsertExpedientData(
        ['motivo_consulta','circunstancias_aparicion','descripcion_fisica','demanda_tratamiento','area_escolar',
        'area_laboral','acontecimientos_significativos','desarrollo_psicosexual',
        'objetivo_terapeutico','estrategia_terapeutica',
        'pronostico_terapeutico','familiograma','area_familiar_relacion',
        'mapeo_familiar','impresiones_diagnosticas_familia',
        'hipotesis_familiar','examen_mental','indicaciones_diagnosticas','foco_terapeutico','fecha_creacion'],
        [null,motivo_de_consulta,circunstancias_aparicion,descripcion_fisica,demanda_tratamiento,
        area_escolar,area_laboral,acontecimientos_significativos,desarrollo_psicosexual,
        objetivo_terapeutico,estrategia_terapeutica,
        pronostico_terapeutico,familiograma,area_familiar_relacion,
        mapeo_familiar,impresiones_diagnosticas_familia,
        hipotesis_familiar,examen_mental,indicaciones_diagnosticas,foco_terapeutico,moment(new Date()).format('YYYY-MM-DD h:mm:ss')],
        'expedientes',
        false
    )
    if (!IdExpedientCreated) {
        return
    }
    relationExpedientPatient(idPatientCreated,IdExpedientCreated);
    insertExpedientSintomas(IdExpedientCreated,'sintoma',sintomas,'sintomas','expedientes_sintomas','id_sintoma')
    insertExpedientImpresionesDiagnosticas(IdExpedientCreated,['eje','dcm','cie','transtorno'],impresiones_diagnosticas,'impresiones_diagnosticas','expedientes_impresiones_diagnosticas','id_impresion_diagnostica')
    insertExpedientModalidadTerapeutica(IdExpedientCreated,['ti','tf','tp','tg','otra','fundamento'],modalidad_terapeutica,'modalidades_terapeuticas','expedientes_modalidades_terapeuticas','id_modalidad')
    const expedientCreated:Expediente = await getExpedientCreated(IdExpedientCreated)
    return expedientCreated
    

}

async function InsertExpedientData(columns: string[], values: any[], table: string, isArray: Boolean) {
    const valuesEstructure = generateValuesEstructure(values)
    const columnsEstructure = generateColumnsEstructure(columns)
    const [rows]: any = await db.pool.query(`INSERT INTO ${table} ${columnsEstructure} VALUES ${valuesEstructure}`, values)
    if (rows.affectedRows) {
        return rows.insertId
    }
    return false
}

async function relationExpedientPatient(id_patient: number, id_expedient: number) {
    const [rows]: any = await db.pool.query(`INSERT INTO expedientes_pacientes (id,id_paciente,id_expediente) VALUES(?,?,?)`, [null, id_patient, id_expedient])
    if (rows.affectedRows) {
        return rows.insertId
    }

}

async function insertExpedientSintomas(id_expedient: number, column: string, values: any[], table: string, table_relation: string, table_relation_column: string) {
    values.forEach(async (value, index) => {
        const [rows]: any = await db.pool.query(`INSERT INTO ${table} (id,${column}) VALUES (?,?)`, [null, value])
        const idLastInserted = rows.insertId
        if (rows.affectedRows) {
            const [rows]: any = await db.pool.query(`INSERT INTO ${table_relation} (id,${table_relation_column},id_expediente) VALUES (?,?,?)`, [null, idLastInserted, id_expedient])
        }
    })
}

async function insertExpedientImpresionesDiagnosticas(id_expedient: number, column: string[], values: any[], table: string, table_relation: string, table_relation_column: string) {

    values.forEach(async (value, index) => {
        let valuesAux: any = [];
        value.forEach((data: any) => {
            valuesAux.push(data)
        })
        const [rows]: any = await db.pool.query(`INSERT INTO ${table} (id,${column}) VALUES (?,?)`, [null, valuesAux])
        const idLastInserted = rows.insertId
        if (rows.affectedRows) {
            const [rows]: any = await db.pool.query(`INSERT INTO ${table_relation} (id,${table_relation_column},id_expediente) VALUES (?,?,?)`, [null, idLastInserted, id_expedient])
        }
    })
}

async function insertExpedientModalidadTerapeutica(id_expedient: number, column: string[], values: any[], table: string, table_relation: string, table_relation_column: string) {

    values.forEach(async (value, index) => {
        let valuesAux: any = [null];
        value.forEach((data: any) => {
            valuesAux.push(data)
        })
        const [rows]: any = await db.pool.query(`INSERT INTO ${table} (id,${column}) VALUES (?,?,?,?,?,?,?)`, valuesAux)
        const idLastInserted = rows.insertId
        if (rows.affectedRows) {
            const [rows]: any = await db.pool.query(`INSERT INTO ${table_relation} (id,${table_relation_column},id_expediente) VALUES (?,?,?)`, [null, idLastInserted, id_expedient])
        }
    })
}

async function getExpedientCreated(idExpediente: number) {

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


    
    const [paciente]: any = await db.pool.query(`SELECT p.id,p.nombre,p.apellido_materno,p.apellido_paterno,p.direccion,p.ingresos_mensuales,p.sexo,p.ocupacion,p.edad
    FROM pacientes p
    INNER JOIN expedientes_pacientes ON id_paciente = p.id
    INNER JOIN expedientes ON expedientes.id = expedientes_pacientes.id_expediente
    WHERE expedientes.id = ${idExpediente}`)

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
     
    return expedient_data
   



}



function generateValuesEstructure(values: any[]) {
    let valuesGenerated = '('
    let lengthValues = (values.length - 1)
    values.forEach((value, index) => {
        if (index == lengthValues) {
            valuesGenerated += `?)`
        } else {
            valuesGenerated += `?,`
        }
    })
    return valuesGenerated
}

function generateColumnsEstructure(columns: any[]) {
    let columnsGenerated = '(id,'
    let lengthColumns = (columns.length - 1)
    columns.forEach((column, index) => {
        if (index == lengthColumns) {
            columnsGenerated += `${column})`
        } else {
            columnsGenerated += `${column},`
        }
    })
    return columnsGenerated
}

async function getSintomas(expedienteId: number) {
    const query = `SELECT sintoma FROM sintomas
    INNER JOIN expedientes_sintomas ON id_sintoma = sintomas.id
    INNER JOIN expedientes ON expedientes_sintomas.id_expediente = expedientes.id
    WHERE expedientes.id = ${expedienteId}`
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
    INNER JOIN expedientes_modalidades_terapeuticas ON id_modalidad = modalidades_terapeuticas.id
    INNER JOIN expedientes ON expedientes_modalidades_terapeuticas.id_expediente = expedientes.id
    WHERE expedientes.id = ${expedienteId}`
    const [rows]: any = await db.pool.query(query)


    //Asignamos los sintomas a un array y retornarmos el arrya con los sintomas
    let modalidades_terapeuticas = rows
    return modalidades_terapeuticas

}


async function getImpresionesDiagnosticas(expedienteId: number) {
    const query = `SELECT eje,dcm,cie,transtorno FROM impresiones_diagnosticas
    INNER JOIN expedientes_impresiones_diagnosticas ON id_impresion_diagnostica = impresiones_diagnosticas.id
    INNER JOIN expedientes ON expedientes_impresiones_diagnosticas.id_expediente = expedientes.id
    WHERE expedientes.id = ${expedienteId}`
    const [rows]: any = await db.pool.query(query)

    //Asignamos las impresiones_diagnosticas a un array y retornarmos el arrya con las impresiones_diagnosticas
    let modalidades_terapeuticas: any = rows
    return modalidades_terapeuticas

}


async function DeleteSintomas(expedienteId: number) {
    const [rows]: any = await db.pool.query(`SELECT id_sintoma FROM expedientes_sintomas WHERE id_expediente = ${expedienteId}`)
    let ids_sintomas: any = []

    rows.forEach((sintoma: any) => {
        ids_sintomas.push(sintoma.id_sintoma)
    })

    //Delete sintomas de sintomas_expedientes
    await db.pool.query(`DELETE FROM expedientes_sintomas WHERE id_expediente = ${expedienteId}`)

    //Delte sintomas from sintomas
    ids_sintomas.forEach(async (id: any) => {
        await db.pool.query(`DELETE FROM sintomas WHERE id = ${id}`)

    })



}

async function DeleteModalidaesTerapeuticas(expedienteId: number) {
    const [rows]: any = await db.pool.query(`SELECT id_modalidad FROM expedientes_modalidades_terapeuticas WHERE id_expediente = ${expedienteId}`)
    let ids_modalidades: any = []

    rows.forEach((modalidad: any) => {
        ids_modalidades.push(modalidad.id_modalidad)
    })

    //Delete sintomas de sintomas_expedientes
    await db.pool.query(`DELETE FROM expedientes_modalidades_terapeuticas WHERE id_expediente = ${expedienteId}`)

    //Delte sintomas from sintomas
    ids_modalidades.forEach(async (id: any) => {
        await db.pool.query(`DELETE FROM modalidades_terapeuticas WHERE id = ${id}`)

    })



}

async function DeleteImpresionesDiagnosticas(expedienteId: number) {
    const [rows]: any = await db.pool.query(`SELECT id_impresion_diagnostica FROM expedientes_impresiones_diagnosticas WHERE id_expediente = ${expedienteId}`)
    let ids_impresiones_diagnosticas: any = []

    rows.forEach((impresion: any) => {
        ids_impresiones_diagnosticas.push(impresion.id_impresion_diagnostica)
    })

    //Delete sintomas de sintomas_expedientes
    await db.pool.query(`DELETE FROM expedientes_impresiones_diagnosticas WHERE id_expediente = ${expedienteId}`)

    //Delte sintomas from sintomas
    ids_impresiones_diagnosticas.forEach(async (id: any) => {
        await db.pool.query(`DELETE FROM impresiones_diagnosticas WHERE id = ${id}`)

    })



}

async function DeleteExpedientes_Pacientes(expedienteId: number) {
    const [rows]: any = await db.pool.query(`DELETE  FROM expedientes_pacientes WHERE id_expediente = ${expedienteId}`)
    await db.pool.query(`DELETE  FROM expedientes WHERE id = ${expedienteId}`)
}

//GET EXPEDIENTS 
async function getAllExpedients(filtros:any){
    const [rows]:any = await db.pool.query(`SELECT e.id,e.fecha_creacion, p.nombre, p.apellido_paterno, p.apellido_materno FROM pacientes p , expedientes e 
    INNER JOIN expedientes_pacientes on expedientes_pacientes.id_expediente = e.id 
    INNER JOIN pacientes on expedientes_pacientes.id_paciente = pacientes.id 
    INNER JOIN usuarios_terapeutas on usuarios_terapeutas.id_paciente = pacientes.id
    INNER JOIN usuarios on usuarios_terapeutas.id_terapeuta = usuarios.id
    WHERE e.id = expedientes_pacientes.id_expediente 
    AND p.id = expedientes_pacientes.id_paciente
    ${filtros.user_id}
    ${filtros.nombre}
    ${filtros.apellido_materno}
    ${filtros.apellido_paterno}`)    
    return rows
   
}


//UPDATE
async function updatePaciente(idExpediente:number,paciente:any){
    const [rows]:any =  await db.pool.query(`SELECT id_paciente FROM expedientes_pacientes WHERE id_expediente = ${idExpediente}`)
    const id_paciente = rows[0].id_paciente

    const {nombre,apellido_materno,apellido_paterno,edad,sexo,ingresos_mensuales,ocupacion} = paciente


    const [result]:any =  await db.pool.query(`UPDATE pacientes SET nombre=? , edad=?, apellido_materno = ?, apellido_paterno =?, ingresos_mensuales = ?, ocupacion = ?, sexo = ? WHERE id=?`,[nombre,edad,apellido_materno,apellido_paterno,ingresos_mensuales,ocupacion,sexo,id_paciente])

}

async function updateSintomas(idExpediente:number,sintomas:any){


    
    //Get sintomas
    const [ids_sintomas]:any = await db.pool.query(`SELECT id_sintoma FROM expedientes_sintomas WHERE id_expediente = ?`,[idExpediente])

    //Update sintomas
    ids_sintomas.forEach(async (sintoma:any,index:number)=> {
        await db.pool.query('UPDATE sintomas SET sintoma = ? WHERE id = ?',[sintomas[index],sintoma.id_sintoma])
    })

    
}


const selectNextId = async () => {
    const [result]:any = await db.pool.query("SELECT id FROM expedientes ORDER BY  id DESC LIMIT 1")  
      
    return result[0].id

} 


 function getAllExpedientsCreateFilters(query:any){
    let filters = {  
        user_id: '',
        nombre: '',
        apellido_materno: '',
        apellido_paterno: ''
    }

    switch (query.nombre) {
        case '':
            filters.nombre  = ''
            break;
        default:
            filters.nombre  = `AND p.nombre = '${query.nombre}'`
            break;
    }

    switch (query.apellido_materno) {
        case '':
            filters.apellido_materno  = ''
            break;
        default:
            filters.apellido_materno  = `AND p.apellido_materno = '${query.apellido_materno}'`
            break;
    }

    switch (query.apellido_paterno) {
        case '':
            filters.apellido_paterno  = ''
            break;
        default:
            filters.apellido_paterno  = `AND p.apellido_paterno = '${query.apellido_paterno}'`
            break;
    }

    switch (query.user_id) {
        case '':
            filters.user_id  = ''
            break;
        default:
            filters.user_id  = `AND usuarios.id = ${query.user_id}`
            break;
    }

    return filters
    
}


export { insertExpedient, getExpedient, getExpedients, updateExpedient, deleteExpedient,selectNextId }