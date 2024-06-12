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
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 12;
		const {
			featured,
			level,
			category,
			company,
			course,
			basic_level,
			price,
			sort,
		} = req.query;

		let queryObject = {};

		if (featured !== undefined) {
			queryObject.featured = featured === 'true';
		}

		if (category && category !== 'all') {
			queryObject.category = category;
		}
		if (company && company !== 'all') {
			queryObject.company = new RegExp(`^${company}$`, 'i');
		}
		if (level && level !== 'all') {
			queryObject.level = level;
		}
		if (course && course !== 'all') {
			queryObject.course = course;
		}
		if (basic_level && basic_level !== 'all') {
			queryObject.basic_level = basic_level;
		}
		if (price) {
			const [minPrice, maxPrice] = price.split('-').map(Number);
			queryObject.price = { $gte: minPrice, $lte: maxPrice };
		}

		let result = Product.find(queryObject).select('-images -user');

		// Sorting
		if (sort) {
			const sortList = {
				'a-z': 'name',
				'z-a': '-name',
				high: '-price',
				low: 'price',
			};
			result = result.sort(sortList[sort] || 'name');
		}

		const totalProducts = await Product.countDocuments({});
		const products = await Product.find(queryObject)
			.select('-images -user')
			.skip((page - 1) * pageSize)
			.limit(pageSize);

		const categories = await Product.distinct('category');
		const companies = await Product.distinct('company');
		const levels = await Product.distinct('level');
		const courses = await Product.distinct('course');
		const basic_levels = await Product.distinct('basic_level');

		const meta = {
			pagination: {
				page,
				pageSize,
				pageCount: Math.ceil(totalProducts / pageSize),
				total: totalProducts,
			},
			categories: ['all', ...categories],
			companies: ['all', ...companies],
			levels: ['all', ...levels],
			courses: ['all', ...courses],
			basic_levels: ['all', ...basic_levels],
		};
		res.status(StatusCodes.OK).json({ data: products, meta });
	} catch (error) {
		throw new CustomError.NotFoundError(`No products can be found.`);
	}
};

const getSingleProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOne({ _id: productId })
		.select('-image -user')
		.populate('reviews');
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
