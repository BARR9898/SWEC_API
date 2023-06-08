import { NextFunction, Request,Response } from "express";

const handleError = (message:string,res?:Response) => {
    console.log(message);
    res?.status(500)
    res?.send({message})
}

export {handleError};