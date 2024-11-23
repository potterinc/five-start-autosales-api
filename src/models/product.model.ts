import { Schema, model } from 'mongoose';
import IProduct from '../interfaces/product.interface';

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, "{PATH} should not be empty"]
  },
  description: {
    type: String,
    required: [true, "{PATH} should not be empty"]
  },
  price: {
    type: Number,
    required: [true, "{PATH} should not be empty"]
  },
  quantity: {
    type: Number,
    required: [true, "{PATH} should not be empty"]
  },
  category: String,
  tag: Array,
  variant: Array,
}, { timestamps: true, versionKey: false });

const Products = model<IProduct>('Product', productSchema, 'Products');
export default Products;