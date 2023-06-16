import { NextFunction, Request,Response } from "express";
import {check,param,query} from 'express-validator';
import { handleValidator } from "../middleware/handleValidators";

const getCitasValidatons = [
    query('id_usuario')
    .exists()
    .notEmpty()
    .isString(),
    query('fecha_inicio')
    .exists()
    .isString(),
    query('fecha_fin')
    .exists()
    .isString(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const getCitasAgendaValidatons = [
    query('id_usuario')
    .exists()
    .notEmpty()
    .isString(),
    query('fecha_inicio')
    .exists()
    .isString(),
    query('fecha_fin')
    .exists()
    .isString(),
    query('asistencia')
    .exists()
    .isString(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const createCitasValidations = [
    check('estatus')
        .exists()
        .notEmpty()
        .isNumeric(),
    check('fecha')
        .notEmpty()
        .exists()
        .isString(),
    check('id_paciente')
        .exists()
        .notEmpty()
        .isNumeric(),
    check('asistencia')
        .exists()
        .notEmpty()
        .isNumeric(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const deleteCitasValidatons = [
    param('id')
        .exists()
        .notEmpty()
        .isString(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const getDateValidations = [
    param('id')
        .exists()
        .notEmpty()
        .isString(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const updateCitasValidations = [
    param('id')
        .exists()
        .notEmpty()
        .isString(),
    check('estatus')
        .exists()
        .notEmpty()
        .isNumeric(),
    check('fecha')
        .exists()
        .notEmpty()
        .isString(),
    check('asistencia')
        .exists()
        .notEmpty()
        .isNumeric(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]


export {getCitasValidatons,getCitasAgendaValidatons,createCitasValidations,deleteCitasValidatons,getDateValidations,updateCitasValidations};