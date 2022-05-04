import { Schema, model } from 'mongoose';

const PaymentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Payment = model('Payment', PaymentSchema);

module.exports = Payment;
