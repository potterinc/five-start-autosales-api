import {Document} from 'mongoose';

interface IProduct extends Document {
  name: string;
  description: string;
  price:number;
  quantity: number;
  category?: string;
  tag?: string[];
  variant?: string[];
}

export default IProduct;