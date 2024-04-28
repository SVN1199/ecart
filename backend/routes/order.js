const express = require('express')
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/authenticate')
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController')
const router = express.Router()

router.route('/order/new').post(isAuthenticateUser, newOrder)
router.route('/order/:id').get(isAuthenticateUser, getSingleOrder)
router.route('/myorders').get(isAuthenticateUser, myOrders)

// Admin routes
router.route('/admin/orders').get(isAuthenticateUser, authorizeRoles('admin'), getAllOrders)
router.route('/admin/order/:id').put(isAuthenticateUser, authorizeRoles('admin'), updateOrder)
router.route('/admin/order/:id').delete(isAuthenticateUser, authorizeRoles('admin'), deleteOrder)

module.exports = router