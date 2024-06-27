const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createJWT } = require('../utils');

const register = async (req, res) => {
	const { email, name, password } = req.body;

	const emailAlreadyExists = await User.findOne({ email });
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError('Email already exists');
	}

	// Register first user as admin
	const isFirstAccount = (await User.countDocuments({})) === 0;
	const role = isFirstAccount ? 'admin' : 'user';

	const user = await User.create({ name, email, password, role });
	const tokenUser = { name: user.name, userId: user._id, role: user.role };
	const token = createJWT({ payload: tokenUser });
	res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	// Check if email & password exist
	if (!email || !password) {
		throw new CustomError.BadRequestError(
			'Please provide email and password'
		);
	}
	const user = await User.findOne({ email });
	// Check if user does not exist
	if (!user) {
		throw new CustomError.UnauthenticatedError('Invalid Credentials');
	}
	// Check if password is correct
	const isPasswordCorrect = await user.comparePassword(password);
	// Check if password is incorrect
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError(
			'Invalid Credentials: password'
		);
	}

	const tokenUser = { name: user.name, userId: user._id, role: user.role };
	const token = createJWT({ payload: tokenUser });
	res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};

const logout = async (req, res) => {
	res.send('Logout user');
};

module.exports = {
	register,
	login,
	logout,
};
