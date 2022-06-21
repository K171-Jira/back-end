import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        maskId: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Order = model('Order', orderSchema);

export default Order;
