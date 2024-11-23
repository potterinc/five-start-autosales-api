import { Document, Types } from 'mongoose';
import { EPaymentMethods, ETransactionTypes } from './transaction.interface';
import IProducts from './product.interface';


enum EStatus {
    PROCESSING = 'PROCESSING',
    ENROUTE = 'ENROUTE',
    DELLIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

type ProdutType = IProducts;

interface IOrders extends Document {
    products:Array<ProdutType>[];
    user: Types.ObjectId;
    deliveryAddress: string;
    totalFee: number;
    paymentMethod: EPaymentMethods;
    type: ETransactionTypes;
    status: EStatus;
};

export default IOrders;
export { EStatus }