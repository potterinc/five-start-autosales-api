import { model, Schema } from "mongoose";

const cartSchema = new Schema({
  customerId: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Customer'
  },

  productId: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Product'
  },

  quantity: {
    type: Number,
    required: true,
    default: 1.00
  },

  price: {
    type: Number,
    required: true
  },

  metadata: Schema.Types.Mixed
});

const Cart = model('Cart', cartSchema, 'ShoppingCart');
export default Cart;
