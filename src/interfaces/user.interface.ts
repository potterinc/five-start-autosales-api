import { Document } from 'mongoose';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    telephone: string;
    homeAddress?: string;
    stateResidence: string;
    email: string;
    password: string;
    vCode?:string;
}

export default IUser;