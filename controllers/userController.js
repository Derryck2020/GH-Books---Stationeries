// const User = require('../models/User');
// const { StatusCodes } = require('http-status-codes');
// const CustomError = require('../errors');

const getAllUsers = async (req, res) => {
	res.send('Get All users');
};
const getSingleUser = async (req, res) => {
	res.send('Get Single user');
};
const showCurrentUser = async (req, res) => {
	res.send('Get Current user');
};
const updateUser = async (req, res) => {
	res.send('Update user');
};
const updateUserPassword = async (req, res) => {
	res.send('Update user password');
};

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
};
