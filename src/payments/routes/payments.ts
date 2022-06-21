import express from 'express';
const router = express.Router();

import User from '../../auth/models/user';
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

router.post('/', async (req, res) => {
	let { id, _id, balance, selectedAmount } = req.body
	let customer: any;
	const user = await User.findById(_id);
	let amount = selectedAmount*100;
	try {
		if(!user.stripe_id){
			
			const customer = await stripe.customers.create({
			email: user.email,
			name: user.firstName,
			metadata: {"order_id": _id},
			payment_method: id,
		})
		console.log(customer.payment_method);
		user.stripe_id = customer.id;
		}
		const customer = await stripe.customers.retrieve (
				user.stripe_id
			)
		const ephemeralKey = await stripe.ephemeralKeys.create(
			{customer: customer.id},
			{apiVersion: '2020-08-27'}
		)
		
		const payment = await stripe.paymentIntents.create({
			amount: amount,
			currency: "EUR",
			customer: customer.id,
			description: "Taškų apmokėjimas",
			payment_method: id,
			setup_future_usage: "on_session",
			confirm: true
		})
		var newBalance= balance+Math.trunc((amount/100));
		user.balance=newBalance;
		const savedUser = await user.save();
		console.log("Payment", payment)
		
		res.json({
			setupIntent: payment.client_secret,
			ephemeralKey: ephemeralKey.secret,
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
