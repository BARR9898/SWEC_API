import { Request,Response,Router } from "express";
import { registerController,loginController,existEmail,resetPassword } from "../controllers/auth";
import { setPasswordValidations,existEmailValidations,loginValidations,registerValidatons} from "../validators/auth";

const router = Router();


router.post("/register",registerValidatons,registerController);
router.post("/login",loginValidations, loginController);
router.post("/reset-password",existEmailValidations,existEmail);
router.post("/set-password",setPasswordValidations,resetPassword);


export {router};