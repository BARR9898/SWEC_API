import "dotenv/config"
//import {connect} from "mongoose"
import { createPool } from "mysql2/promise";

// create the connection to database
export const pool =  createPool({
        host: 'localhost',
        user: 'development',
        database: 'expedientesdb',
        port:8889,
        password:''
    
});

      

 

export default {pool}; 