import { Request,Response,Router } from "express";
import { getExpediente , getExpedientes  , deleteExpediente , postExpediente,getNextId} from "../controllers/expedientes";
import { logMiddleware } from "../middleware/log";
import { checkJWT } from "../middleware/session";
import { createExpedientValidators,validateGetExpedientesFilter,validateGetExpediente,validateDeleteExpediente } from "../validators/expedientes";
import { filtersValidations } from "../validators/filtros";
const router = Router();

/*
    EXAMPPLE-MIDDELWARE
    router.get("/" , checkJWT ,getExpedientes);
*/


router.get("/" , validateGetExpedientesFilter  ,getExpedientes);
router.get("/getNextId"  ,getNextId);
router.get("/:id" , validateGetExpediente , logMiddleware, getExpediente);
router.post("/" ,createExpedientValidators,postExpediente);
router.delete("/:id" ,validateDeleteExpediente, deleteExpediente);




export {router};