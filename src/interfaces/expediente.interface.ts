export interface Expediente{
    paciente:{
        nombre:string,
        edad:string,
        sexo:'M'|'F' | 'O',
        apellido_paterno:string,
        apellido_materno:string,
        ocupacion: string | null,
        ingresos_mensuales: string | null,
        direccion: string | null

    },
    expediente:{
        motivo_de_consulta:string,
        circunstancias_de_aparicion:string,
        sintomas:JSON[] | any[],
        descripcion_fisica:string,
        demanda_de_tratamiento:string,
        area_escolar:string,
        area_laboral:string,
        acontecimientos_significativos:string,
        desarrollo_psicosexual:string,
        familiograma:string,
        area_de_relacion_y_familiar:string,
        mapeo_familiar:string,
        impresion_diagnostica_de_familia:string,
        hipotesis_familiar: string,
        examen_mental:string,
        indicaciones_diagnosticas:string,
        impresiones_diagnosticas:JSON[] | any[],
        modalidad_terapeutica: JSON[] | any[],
        objetivo_terapeutico: string | null,
        estrategias_terapeuticas: [JSON] | [any]
        pronostico_terapeutico: string | null,
        foco: string | null
    }
}



