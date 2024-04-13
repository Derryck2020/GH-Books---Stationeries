const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const createProduct = async (req, res) => {
	req.body.user = req.user.userId;
	const product = await Product.create(req.body);
	res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
	const products = await Product.find({});
	res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOne({ _id: productId }).populate(
		'reviews'
	);
	if (!product) {
		throw new CustomError.NotFoundError(`No product with id : ${productId}`);
	}
	res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOneAndUpdate(
		{ _id: productId },
		req.body,
		{ new: true, runValidators: true }
	);
	if (!product) {
		throw new CustomError.NotFoundError(`No product with id : ${productId}`);
	}
	res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOne({ _id: productId });

	if (!product) {
		throw new CustomError.NotFoundError(`No product with id : ${productId}`);
	}
	await product.deleteOne({ _id: productId });

	res.status(StatusCodes.OK).json({ msg: 'Success! Product Removed' });
};

const uploadImage = async (req, res) => {
	const result = await cloudinary.uploader.upload(
		req.files.image.tempFilePath,
		{
			use_filename: true,
			folder: 'books-gallery',
		}
	);
	fs.unlinkSync(req.files.image.tempFilePath);
	return res
		.status(StatusCodes.OK)
		.json({ image: { src: result.secure_url } });
};

module.exports = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
};
