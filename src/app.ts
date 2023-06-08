import "dotenv/config";
import express from "express";
import cors from "cors";
import {router} from "./routes"

let PORT =  0 ;
switch (process.env.ENVIROMENT) {
    case 'DEVELOPMENT':
        PORT = parseInt(process.env.DEV_PORT!) || 3002;
        break;

    case 'TESTING':
        
        break;

    default:
        PORT = parseInt(process.env.PROD_PORT!) || 3002;
        break;
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT , () => {
    console.log(`***APLICACION CORRIENDO EN PUERTO ${PORT} *****`);
    
})
