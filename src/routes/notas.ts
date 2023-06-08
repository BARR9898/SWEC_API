import { Request,Response,Router } from "express";
import { postNota,getAllNotas,getNote,updateCita,deleteCita} from "../controllers/notas";

import { logMiddleware } from "../middleware/log";
import { checkJWT } from "../middleware/session";
import { updateDate } from "../services/citas";

const router = Router();

/*
    EXAMPPLE-MIDDELWARE
    router.get("/" , checkJWT ,getExpedientes);
*/


router.get("/all/:id" , getAllNotas);
router.get("/:id" , getNote);
router.post("/" , postNota );
router.put("/:id" , updateCita);
router.delete("/:id" , deleteCita);




export {router};