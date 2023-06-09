import { Request,Response,Router } from "express";
import { postNota,getAllNotas,getNote} from "../controllers/notas";

import { logMiddleware } from "../middleware/log";
import { checkJWT } from "../middleware/session";
import { updateDate } from "../services/citas";
import { getNotasValidations,getNoteValidations,createNoteValidations } from "../validators/notas";

const router = Router();

/*
    EXAMPPLE-MIDDELWARE
    router.get("/" , checkJWT ,getExpedientes);
*/


router.get("/all/:id",getNotasValidations,getAllNotas);
router.get("/:id",getNoteValidations,getNote);
router.post("/",createNoteValidations,postNota );




export {router};