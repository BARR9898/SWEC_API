import { Request,Response,Router } from "express";
import { getExpediente , getExpedientes , updateExpediente , deleteExpediente , postExpediente} from "../controllers/expedientes";
import { logMiddleware } from "../middleware/log";
import { checkJWT } from "../middleware/session";

const router = Router();

/*
    EXAMPPLE-MIDDELWARE
    router.get("/" , checkJWT ,getExpedientes);
*/


router.get("/" , checkJWT ,getExpedientes);
router.get("/:id" , logMiddleware, getExpediente);
router.post("/" , postExpediente);
router.put("/:id" , updateExpediente);
router.delete("/:id" , deleteExpediente);




export {router};