import db from "../config/mysql"
import { handleError } from "../middleware/handleError"
import { Res } from "../interfaces/response"

async function insertPaciente(patient: any , usuario_id:any) : Promise<Res> {
   
    let response:Res = {
        result:false,
        data: []
    }

    try {
        
        const { nombre, apellido_materno, apellido_paterno, edad, sexo, direccion, ingresos_mensuales, ocupacion } = patient
        const [result_insert_paciente]: any = await db.pool.query("INSERT INTO pacientes (id,nombre,apellido_materno,apellido_paterno,edad,sexo,direccion,ingresos_mensuales,ocupacion,id_usuario,estatus) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [null, nombre, apellido_materno, apellido_paterno, edad, sexo, direccion, ingresos_mensuales, ocupacion,usuario_id,true])
        if (!result_insert_paciente.affectedRows) {
            response.result =  false,
            response.data = []
            response.message = 'No se  registro el paciente'
            return response
    
        } 
            
        response.result =  true,
        response.data = result_insert_paciente.insertId
        response.message = 'Paciente registrado  correctamente'
        return response

    } catch (error:any) {
        response.result = false
        response.data = [error],
        response.message = 'Error al registrar el paciente'
        return response 

    }


}
const selectPaciente = async (id:string) => { 

    const [result]:any = await db.pool.query('SELECT * FROM terapeutas WHERE id =  ?',[id])
    return result
        
}

const deletePaciente = async (id: any) => {

    const [result_delete_terapeuta]:any = await db.pool.query('DELETE FROM terapeutas WHERE id = ?',
    [id])

    if (!result_delete_terapeuta.affectedRows) {
        return false
    }



    return true
    
}

const updatePaciente = async (terapeuta: any) => {
    const {id,nombre,apellido_materno,apellido_paterno} = terapeuta

    const [result_update_terapeuta]:any = await db.pool.query('UPDATE terapeutas  SET  nombre = ? , apellido_materno = ? ,  apellido_paterno = ? WHERE  id  = ?',[nombre,apellido_materno,apellido_paterno,id])
    
    if (result_update_terapeuta.affectedRows != 1) {
        return  false
    }

    return  true
    
    
    

}

export { insertPaciente,deletePaciente,selectPaciente,updatePaciente}