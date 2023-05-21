import { Request,Response,Router } from "express";
import { registerController,loginController,existEmail,resetPassword } from "../controllers/auth";

const router = Router();


router.post("/register",registerController);
router.post("/login", loginController);
router.post("/reset-password", existEmail);
router.post("/set-password", resetPassword);


export {router};