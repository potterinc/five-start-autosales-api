import { Schema, model } from "mongoose";
import ITransactions, { ETransactionTypes, EPaymentMethods } from "../interfaces/transaction.interface";

// Logs various aspects of transactions tied to a user
const transactionSchema = new Schema({

    type: {
        type: String,
        enum: Object.values(ETransactionTypes),
        required: true
    },

    paymentMethod: {
        type: String,
        enum: EPaymentMethods,
        default: EPaymentMethods.CARD
    },

    amount: Number,

    txRef: {
        type: Schema.ObjectId,
        ref: 'Orders'
    },

    user: Schema.ObjectId,

}, {
    timestamps: true,
    versionKey: false
});

const Transactions = model<ITransactions>('Transactions', transactionSchema, "Transactions");
export default Transactions;