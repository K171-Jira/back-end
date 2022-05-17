import express from 'express';
const router = express.Router();

import User from '../../auth/models/user';
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

router.post('/', async (req, res) => {
	let { amount, id, _id, balance } = req.body
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "EUR",
			description: "Taškų apmokėjimas",
			payment_method: id,
			confirm: true
		})
		const user = await User.findById(_id);
		var newBalance= balance+(amount/100);
		user.balance=newBalance;
		const savedUser = await user.save();
		console.log("Payment", payment)
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
});

module.exports = router;
