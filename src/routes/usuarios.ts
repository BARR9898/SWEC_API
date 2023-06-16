import { Request,Response,Router } from "express";
import { getAllUsuarios , postUsuario,removeUsuario,getUsuario,updateUsuario} from "../controllers/usuarios";
import { logMiddleware } from "../middleware/log";
import { checkJWT } from "../middleware/session";

const router = Router();

/*
    EXAMPPLE-MIDDELWARE
    router.get("/" , checkJWT ,getExpedientes);
*/


router.get("/"  ,getAllUsuarios);
router.post("/" , postUsuario);
router.delete("/:id" , removeUsuario);
router.get("/:id" , getUsuario);
router.put("/:id" , updateUsuario);


export {router};