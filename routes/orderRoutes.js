const express = require('express');
const router = express.Router();
const {
	authenticateUser,
	// authorizePermissions,
} = require('../middleware/authentication');

const {
	createOrder,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	updateOrder,
} = require('../controllers/orderController');

router.route('/').post(createOrder).get(getAllOrders);

router.route('/showAllMyOrders').get(getCurrentUserOrders);

router.route('/:id').get(getSingleOrder).patch(updateOrder);

module.exports = router;
