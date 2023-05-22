import { Request,Response,Router } from "express";
import { getAllTerapeutas , postTerapeuta } from "../controllers/terapeutas";
import { logMiddleware } from "../middleware/log";
import { checkJWT } from "../middleware/session";

const router = Router();

/*
    EXAMPPLE-MIDDELWARE
    router.get("/" , checkJWT ,getExpedientes);
*/


router.get("/"  ,getAllTerapeutas);
router.post("/" , postTerapeuta);


export {router};