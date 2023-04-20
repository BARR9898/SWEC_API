import {Schema,Types,model,Models} from "mongoose"
import { Expediente } from "../interfaces/expediente.interface";
import { Citas } from "../interfaces/citas.interface";

const ExpedienteSchema = new Schema<Expediente>(
    {
      paciente:{
        nombre:{
            type:String,
            required:true
        },
        edad:{
            type:String,
            required:true
        },
        sexo:{
            type:String,
            required:true

        },
        apellido_paterno:{
            type:String,
            required:true

        },
        apellido_materno:{
            type:String,
            required:true

        },
        ocupacion:{
            type:String,
            requried:true
        },
        ingresos_mensuales:{
            type:String,
            required: true
        },
        direccion: {
            type: String,
            required: true
        }

        
      },
      expediente:{
        motivo_de_consulta:{
            type:String,
            required:true

        },
        circunstancias_de_aparicion:{
            type:String,
            required:true

        },
        sintomas:{
            type:[JSON],
            required:true

        },
        descripcion_fisica:{
            type:String,
            required:true

        },
        demanda_de_tratamiento:{
            type:String,
            required:true

        },
        area_escolar:{
            type:String,
            required:true

        },
        area_laboral:{
            type:String,
            required:true

        },
        acontecimientos_significativos:{
            type:String,
            required:true

        },
        desarrollo_psicosexual:{
            type:String,
            required:true

        },
        familiograma:{
            type:String,
            required:true

        },
        area_de_relacion_y_familiar:{
            type:String,
            required:true

        },
        mapeo_familiar:{
            type:String,
            required:true

        },
        impresion_diagnostica_de_familia:{
            type:String,
            required:true

        },
        hipotesis_familiar:{
            type:String,
            required:true

        },
        examen_mental:{
            type:String,
            required:true

        },
        indicaciones_diagnosticas:{
            type:String,
            required:true

        },
        impresiones_diagnosticas:{
            type:[JSON],
            required:true

        },
        modalidad_terapeutica: {
            type: [JSON],
            required:true
        },
        objetivo_terapeutico: {
            type: String,
            required:true
        },
        estrategias_terapeuticas:  {
            type: [JSON],
            required:true
        },
        pronostico_terapeutico: {
            type: String,
            required:true
        },
        foco: {
            type: String,
            required:true
        }
      },
      notas_clinicas:{
        type:[JSON],
        required: true
      },
      expediente_id:{
        type: Number,
        required: true
      },
      citas:{
        type:Array<Citas>,
        required: true
      }

    },
    {
      timestamps: true,
      versionKey: false
        
    }
);

const ExpedienteModel = model("expedientes",ExpedienteSchema);
export default ExpedienteModel;