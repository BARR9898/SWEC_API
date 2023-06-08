import { NextFunction, Request,Response } from "express";
import {check,param,query} from 'express-validator';
import { handleValidator } from "../middleware/handleValidators";

const createExpedientValidators = [
    check('paciente.nombre')
    .exists()
    .notEmpty()
    .isString(),
    check('paciente.edad')
    .exists()
    .notEmpty()
    .isString(),
    check('paciente.sexo')
    .exists()
    .notEmpty()
    .isString(),
    check('paciente.apellido_materno')
    .exists()
    .notEmpty()
    .isString(),
    check('paciente.apellido_paterno')
    .exists()
    .notEmpty()
    .isString(),
    check('paciente.ocupacion')
    .exists()
    .notEmpty()
    .isString(),
    check('paciente.ingresos_mensuales')
    .exists()
    .notEmpty()
    .isString(),
    check('paciente.direccion')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.motivo_de_consulta')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.circunstancias_de_aparicion')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.sintomas')
    .exists()
    .notEmpty()
    .isArray(),
    check('expediente.descripcion_fisica')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.demanda_de_tratamiento')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.area_escolar')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.area_laboral')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.acontecimientos_significativos')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.desarrollo_psicosexual')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.familiograma')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.area_de_relacion_y_familiar')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.mapeo_familiar')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.impresion_diagnostica_de_familia')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.hipotesis_familiar')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.examen_mental')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.indicaciones_diagnosticas')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.impresiones_diagnosticas')
    .exists()
    .notEmpty()
    .isArray(),
    check('expediente.modalidad_terapeutica')
    .exists()
    .notEmpty()
    .isArray(),
    check('expediente.objetivo_terapeutico')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.estrategia_terapeutica')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.pronostico_terapeutico')
    .exists()
    .notEmpty()
    .isString(),
    check('expediente.foco_terapeutico')
    .exists()
    .notEmpty()
    .isString(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }
]

const validateGetExpedientesFilter = [
    query('nombre')
    .exists()
    .isString(),
    query('fecha_inicio')
    .exists()
    .isString(),
    query('fecha_fin')
    .exists()
    .isString(),
    query('estatus')
    .exists()
    .isString(),
    query('id_usuario')
    .exists()
    .isString()
    .notEmpty(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const validateGetExpediente = [
    param('id')
    .exists()
    .isString()
    .notEmpty(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const validateDeleteExpediente = [
    param('id')
    .exists()
    .isString()
    .notEmpty(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]
export {createExpedientValidators,validateGetExpedientesFilter,validateGetExpediente,validateDeleteExpediente};