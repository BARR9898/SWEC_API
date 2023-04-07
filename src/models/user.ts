import {Schema,Types,model,Models} from "mongoose"
import { User } from "../interfaces/user.interface";

const UserSchema = new Schema<User>(
    {
        name: {
            type:String,
            required: true
        },
        description:{
            type:String,
            required: true,
            default: "Sin descripccion"
        },
        password:{
            type:String,
            required: true
        },
        email:{
            type:String,
            required: true,
            unique: true
        },
        rol: {
            type:String,
            required: true
        }



    },
    {
      timestamps: true,
      versionKey: false
        
    }
);

const UserModel = model("user",UserSchema);
export default UserModel;
