const express = require('express');
const router = express.Router();
const {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} = require('../controllers/userController');

// route for get
router.route('/').get(getAllUsers);
router.route('/showUser').get(showCurrentUser);
// route for patch
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);

// route for single user
router.route('/:id').get(getSingleUser);

module.exports = router;
