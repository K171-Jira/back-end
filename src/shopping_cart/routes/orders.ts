import express from 'express';
// import bcrypt from 'bcrypt';
import User from '../../auth/models/user';
import Order from '../models/order';
const router = express.Router();

router.get('/getOrder/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/placeOrder', async (req, res) => {
  try {
    const order = new Order({
      userId: req.body.userId,
      orderItems: {
        maskId: req.body.maskId,
        amount: req.body.amount,
        price: req.body.address.price,
      },
    });
    await order.save();
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
