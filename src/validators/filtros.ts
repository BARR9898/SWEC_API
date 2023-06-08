import { NextFunction, Request,Response } from "express";
import {check,param,query} from 'express-validator';
import { handleValidator } from "../middleware/handleValidators";

const filtersValidations = [
    query('nombre')
    .exists()
    .isString(),
    query('apellido_materno')
    .exists()
    .isString(),
    query('apellido_paterno')
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
    .notEmpty()
    .isString(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }
]




    




export {filtersValidations};