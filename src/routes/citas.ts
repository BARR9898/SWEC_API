import { Request,Response,Router } from "express";
import { getExpediente , getExpedientes  , deleteExpediente , postExpediente} from "../controllers/expedientes";
import { postCita,getAllCitas,getCita,updateCita,deleteCita,getAllCitas_agenda} from "../controllers/citas";

import { logMiddleware } from "../middleware/log";
import { checkJWT } from "../middleware/session";
import { updateDate } from "../services/citas";

const router = Router();

/*
    EXAMPPLE-MIDDELWARE
    router.get("/" , checkJWT ,getExpedientes);
*/


router.get("/all/:id" , getAllCitas);
router.get("/agenda/" , getAllCitas_agenda);
router.get("/:id" , getCita);
router.post("/" , postCita );
router.put("/:id" , updateCita);
router.delete("/:id" , deleteCita);




export {router};