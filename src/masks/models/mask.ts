import { Schema, model } from 'mongoose';
import { MaskType } from './mask_type';

interface IMask {
  name: string;
  brand: string;
  imageUrl: string;
  amount: number;
  price: number;
  type: MaskType;
}

const MaskSchema = new Schema<IMask>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: MaskType, required: true },
  },
  { timestamps: true }
);

const Mask = model('Mask', MaskSchema);

module.exports = Mask;
