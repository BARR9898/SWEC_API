import "dotenv/config"
//import {connect} from "mongoose"
import { createPool } from "mysql2/promise";

// create the connection to database

let configConexionDB = {
        host: '',
        user: '',
        database: '',
        port: 0,
        password: ''
}

switch (process.env.ENVIROMENT) {
        case 'DEVELOPMENT':
                configConexionDB = {
                        host: process.env.DEV_DB_HOST!,
                        user: process.env.DEV_DB_USER!,
                        database: process.env.DEV_DB_DATABASE!,
                        port:parseInt(process.env.DEV_DB_PORT!),
                        password: process.env.DEV_DB_PASSWORD!,
                }
                
                break;
        case 'TESTING':
                /*
                configConexionDB = {
                        host: process.env.DEV_DB_HOST!,
                        user: process.env.DEV_DB_USER!,
                        database: process.env.DEV_DB_DATABASE!,
                        port:parseInt(process.env.ENV_DB_PORT!),
                        password: process.env.DEV_DB_PASSWORD!,
                }*/
                break;
        default:
                configConexionDB = {
                        host: process.env.PROD_DB_HOST!,
                        user: process.env.PROD_DB_USER!,
                        database: process.env.PROD_DB_DATABASE!,
                        port:parseInt(process.env.PROD_DB_PORT!),
                        password: process.env.PROD_DB_PASSWORD!,
                }
                break;
}

export const pool =  createPool(configConexionDB);
pool.getConnection().then(() => {
        console.log('BDD CONECTADA  CON EXITO');      
})

export default {pool}; 