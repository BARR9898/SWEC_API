import { hash,compare } from "bcryptjs"

const encrypt = async (passPlane:string) => {
    const passwordHash = await hash(passPlane,8);
    return passwordHash;


}


const verfied = async (passPlane:string,passHash:string) => {
    const isCorrect = await compare(passPlane,passHash);
    return isCorrect;
}

export {encrypt,verfied}