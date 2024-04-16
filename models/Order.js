const mongoose = require('mongoose');

const SingleOrderItemSchema = mongoose.Schema({
	name: { type: String, required: true },
	image: {
		width: Number,
		height: Number,
		url: String,
		filename: String,
		size: Number,
		type: String,
	},
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	product: {
		type: mongoose.Schema.ObjectId,
		ref: 'Product',
		required: true,
	},
});

const OrderSchema = mongoose.Schema(
	{
		tax: {
			type: Number,
			required: true,
		},
		shippingFee: {
			type: Number,
			required: true,
		},
		subTotal: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		orderItems: [SingleOrderItemSchema],
		status: {
			type: String,
			enum: ['pending', 'failed', 'paid', 'delivered', 'cancelled'],
			default: 'pending',
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		clientSecret: {
			type: String,
			required: true,
		},
		paymentIntentId: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
