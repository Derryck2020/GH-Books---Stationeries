const express = require('express');
const router = express.Router();
const {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} = require('../controllers/userController');
const {
	authenticateUser,
	authorizePermissions,
} = require('../middleware/authentication');

// route for get
router
	.route('/')
	.get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/showUser').get(authenticateUser, showCurrentUser);
// route for patch
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

// route for single user
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
