import { Document, Types } from "mongoose";

// Types of transactions
enum ETransactionTypes {
    FUNDING = 'FUNDING',
    PURCHASE = 'PURCHASE',
};

// Payment Methods
enum EPaymentMethods {
    CARD = 'CARD',
    WALLET = 'WALLET'
};

// Transactions
interface ITransactions extends Document {
    txRef: Types.ObjectId;
    type: ETransactionTypes;
    refID?:string;
    amount: number;
    paymentMethod?: EPaymentMethods;
    user: Types.ObjectId;
}

export default ITransactions;
export { EPaymentMethods, ETransactionTypes };