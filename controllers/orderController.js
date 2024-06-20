const Order = require('../models/Order');
const Product = require('../models/Product');

const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

// const fakeStripeApI = async ({ amount, currency }) => {
// 	const client_secret = 'someRandomValue';
// 	return { client_secret, amount };
// };

const createOrder = async (req, res) => {
	const { name, address, cartItems, subTotal, orderTotal, discount } =
		req.body;

	if (!cartItems || cartItems.length < 1) {
		throw new CustomError.BadRequestError('No cart items provided');
	}

	if (!name || !address) {
		throw new CustomError.BadRequestError('Please provide name and address');
	}

	let orderItems = [];
	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product });
		if (!dbProduct) {
			throw new CustomError.NotFoundError(
				`No product with id: ${item.product}`
			);
		}
		const {
			name: productName,
			price,
			discount,
			images,
			_id: product,
		} = dbProduct;
		const getImage = images[0].url;

		const singleOrderItem = {
			amount: item.amount,
			name: productName,
			discount,
			price,
			image: getImage,
			product: product,
		};
		orderItems = [...orderItems, singleOrderItem];
	}

	const order = await Order.create({
		name,
		address,
		subTotal,
		total: orderTotal,
		cartItems,
		discount,
		user: req.user.userId,
	});

	res.status(StatusCodes.CREATED).json({ order });
};

const getAllOrders = async (req, res) => {
	const orders = await Order.find({});
	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
	const { id: orderId } = req.params;
	const order = await Order.findOne({ _id: orderId });
	if (!order) {
		throw new CustomError.NotFoundError(`No order with id: ${item.product}`);
	}
	checkPermissions(req.user, order.user);
	res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
	const orders = await Order.find({ user: req.user.userId });
	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
	const { id: orderId } = req.params;
	const { paymentIntent } = req.body;

	const order = await Order.findOne({ _id: orderId });
	if (!order) {
		throw new CustomError.NotFoundError(`No order with id: ${item.product}`);
	}
	checkPermissions(req.user, order.user);

	order.paymentIntent = paymentIntent;
	order.staus = 'paid';
	await order.save();

	res.status(StatusCodes.OK).json({ order });
};

module.exports = {
	createOrder,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	updateOrder,
};
