import { Auth } from "./auth.interface";

export interface User extends Auth{
    name: string,
    description: string,
    rol: "Administrador" | "Superusuario" | "Terapeuta",
    lastname: string,
    second_lastname: string,

}