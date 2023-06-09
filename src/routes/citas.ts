import { Request,Response,Router } from "express";
import { getExpediente , getExpedientes  , deleteExpediente , postExpediente} from "../controllers/expedientes";
import { postCita,getAllCitas,getCita,updateCita,deleteCita,getAllCitas_agenda} from "../controllers/citas";

import { logMiddleware } from "../middleware/log";
import { checkJWT } from "../middleware/session";
import { updateDate } from "../services/citas";
import { getCitasValidatons,getCitasAgendaValidatons,createCitasValidations,deleteCitasValidatons,getDateValidations,updateCitasValidations} from "../validators/citas";

const router = Router();

/*
    EXAMPPLE-MIDDELWARE
    router.get("/" , checkJWT ,getExpedientes);
*/


router.get("/all",getCitasValidatons,getAllCitas);
router.get("/agenda",getCitasAgendaValidatons,getAllCitas_agenda);
router.get("/:id",getDateValidations,getCita);
router.post("/",createCitasValidations,postCita );
router.put("/:id",updateCitasValidations,updateCita);
router.delete("/:id" ,deleteCitasValidatons,deleteCita);




export {router};