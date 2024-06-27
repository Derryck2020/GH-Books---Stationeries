const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
	let token;

	// Check the authorization header for the token
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		token = authHeader.split(' ')[1];
	}

	if (!token) {
		throw new CustomError.UnauthenticatedError('Authentication Invalid');
	}

	try {
		const { name, userId, role } = isTokenValid(token);
		req.user = { name, userId, role }; // Attach the payload (user info) to the request object

		next();
	} catch (error) {
		throw new CustomError.UnauthenticatedError('Authentication Failed');
	}
};

const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthorizedError(
				'Unauthorized to access this route'
			);
		}
		next();
	};
};

module.exports = {
	authenticateUser,
	authorizePermissions,
};
