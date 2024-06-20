const mongoose = require('mongoose');

const ProductImageSchema = new mongoose.Schema({
	url: String,
	filename: String,
	size: Number,
	type: String,
	thumbnail: String,
});

const SingleOrderItemSchema = new mongoose.Schema({
	name: { type: String, required: true },
	images: [ProductImageSchema],
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	discount: { type: Number },
	product: {
		type: mongoose.Schema.ObjectId,
		ref: 'Product',
		required: true,
	},
});

const OrderSchema = new mongoose.Schema(
	{
		discount: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			trim: true,
			required: [true, 'Please provide your name'],
		},
		address: {
			type: String,
			required: [true, 'Please provide your address'],
		},
		subTotal: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		cartItems: [SingleOrderItemSchema],
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
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
