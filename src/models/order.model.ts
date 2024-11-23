import { Schema, model } from "mongoose";
import IOrders, { EStatus } from "../interfaces/order.interface";
import { EPaymentMethods, ETransactionTypes } from "../interfaces/transaction.interface";

const orderSchema = new Schema({
    products: {
        type: Schema.Types.Array,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },

    deliveryAddress: {
        type: String,
        required: true
    },

    totalFee: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: Object.values(EPaymentMethods),
        default: EPaymentMethods.WALLET
    },

    type: {
        type: String,
        enum: Object.values(ETransactionTypes),
        default: ETransactionTypes.PURCHASE,
        required: true
    },

    status: {
        type: String,
        enum: Object.values(EStatus),
        default: EStatus.PROCESSING
    }
}, {
    timestamps: true,
    versionKey: false
});

const Orders = model<IOrders>('Orders', orderSchema, 'Purchases');
export default Orders;