import "dotenv/config";
import express from "express";
import cors from "cors";
import {router} from "./routes"

const PORT = process.env.PORT || 3002;
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);


 




//db().then(() => console.log("***BDD CONECTADA***"))
app.listen(PORT , () => {
    console.log(`***APLICACION CORRIENDO EN PUERTO ${PORT}`);
    
})
