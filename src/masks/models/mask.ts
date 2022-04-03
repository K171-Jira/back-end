import { Schema, model } from 'mongoose';
const MaskTypes = require('./mask_type');

const MaskSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(MaskTypes), required: true },
  },
  { timestamps: true }
);

const Mask = model('Mask', MaskSchema);

module.exports = Mask;
