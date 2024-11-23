import { Schema, model } from "mongoose";
import IUser from "../interfaces/user.interface";

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    telephone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        maxlength: [14, 'phone number exceeds maximum length'],
        validate: {
            validator: function (tel: string) {
                return /^([+/.])\d{13}$/.test(tel);
            },
            message: "{VALUE} isn\'t a valid phone number"
        }
    },
    stateResidence: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: {
            validator: function (data: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
            },
            message: "{VALUE} is not a valid email address",
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        minlength: [6, 'Password too short']
    },
    homeAddress: {
        type: String,
        required: true
    },
    vCode: String,
    walletBalance: {
        type: Number,
        default: 0.00
    }
}, {
    timestamps: true,
    versionKey: false
});


const Customer = model<IUser>("Customer", userSchema, 'RegisteredCustomers');
export default Customer