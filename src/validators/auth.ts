import { NextFunction, Request,Response } from "express";
import {check,param,query} from 'express-validator';
import { handleValidator } from "../middleware/handleValidators";

const setPasswordValidations = [
    check('user_id')
    .exists()
    .notEmpty()
    .isString(),
    check('new_password')
    .exists()
    .notEmpty()
    .isString(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }
]

const existEmailValidations = [
    check('email')
    .exists()
    .isString(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const loginValidations = [
    check('email')
    .exists()
    .isString()
    .notEmpty(),
    check('password')
    .exists()
    .isString()
    .notEmpty(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]

const registerValidatons = [
    check('email')
    .exists()
    .isString()
    .notEmpty(),
    check('password')
    .exists()
    .isString()
    .notEmpty(),
    check('rol')
    .exists()
    .isString()
    .notEmpty(),
    check('lastname')
    .exists()
    .isString()
    .notEmpty(),
    check('second_lastname')
    .exists()
    .isString()
    .notEmpty(),
    (req:Request,res:Response,next:NextFunction) => {
        handleValidator(req,res,next)
    }


]


export {setPasswordValidations,existEmailValidations,loginValidations,registerValidatons};