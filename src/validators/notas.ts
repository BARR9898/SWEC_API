import { NextFunction, Request,Response } from "express";
import {check,param,query} from 'express-validator';
import { handleValidator } from "../middleware/handleValidators";

const getNotasValidations = [
    param('id')
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

const getNoteValidations = [
    param('id')
    .exists()
    .notEmpty()
    .isString(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const createNoteValidations = [
    check('fecha')
    .exists()
    .notEmpty()
    .isString(),
    check('nota')
    .exists()
    .notEmpty()
    .isString(),
    check('id_expediente')
    .exists()
    .notEmpty()
    .isNumeric(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]




export {getNotasValidations,getNoteValidations,createNoteValidations};