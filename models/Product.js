const mongoose = require('mongoose');

const ProductImageSchema = new mongoose.Schema({
	width: Number,
	height: Number,
	url: String,
	filename: String,
	size: Number,
	type: String,
});

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [true, 'Please provide product name'],
		maxlength: [100, 'Name cannot be more than 100 characters'],
	},
	price: {
		type: Number,
		required: [true, 'Please provide product price'],
		default: 0,
	},
	level: {
		type: String,
		required: [true, 'Please a level is required'],
		enum: [
			'senior high',
			'junior high',
			'upper primary',
			'lower primary',
			'kindergarten and nursery',
			'others',
		],
	},
	course: {
		type: String,
		required: [true, 'Please Course or subject is required'],
		enum: [
			'core subjects',
			'elective subjects',
			'general Science',
			'general arts',
			'business',
			'agriculture',
			'visual arts',
			'home economics',
			'mathematics',
			'english',
			'science',
			'history',
			'creative arts',
			'our world our people',
			'religious and moral edu',
			'physical education',
			'french',
			'computing',
		],
	},
	category: {
		type: String,
		required: [true, 'Please provide product category'],
		enum: ['textbooks', 'questions and answers'],
	},
	basic_level: {
		type: String,
		enum: [
			'basic 1',
			'basic 2',
			'basic 3',
			'basic 4',
			'basic 5',
			'basic 6',
			'basic 7',
			'basic 8',
			'basic 9',
			'none',
		],
	},
	company: {
		type: String,
		required: [true, 'Please provide product company'],
		enum: {
			values: [
				'a+ series',
				'best brain',
				'aki ola',
				'excellence',
				'a.a series',
				'approachers',
				'alpha and omega',
				'masterman',
				'victory',
				'GAST',
				'a1 challenge',
				'anointing',
				'atta kay',
				'concise',
				'golden',
				'in scope',
				'kosooko',
				'mopac',
				'others',
			],
			message: '{VALUE} is not supported',
		},
	},
	featured: {
		type: Boolean,
		default: false,
	},
	description: {
		type: String,
		required: [true, 'Please provide product description'],
		maxlength: [1000, 'Description cannot be more than 1000 characters'],
	},
	inventory: {
		type: Number,
		required: true,
		default: 15,
	},
	image: [ProductImageSchema, ProductImageSchema, ProductImageSchema],
	averageRating: {
		type: Number,
		default: 0,
	},
	numOfReviews: {
		type: Number,
		default: 0,
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

module.exports = mongoose.model('Product', ProductSchema);