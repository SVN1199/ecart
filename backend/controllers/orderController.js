const catchAsyncError = require('../middlewares/catchAsyncError')
const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')

// create new order   -  /api/v1/order/new
const newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
})

// get single order   -  /api/v1/order/:id
const getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
        return next(new ErrorHandler(`Order not found this ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})


// Get Loggedin User Orders  -  /api/v1/myorders
const myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    if (!orders) {
        return next(new ErrorHandler(`Order not found this ${orders}`, 404))
    }

    res.status(200).json({
        success: true,
        orders
    })
})


// Admin : Get All Orders  -  /api/v1/orders
const getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find()
    let totalAmount = 0

    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Admin   Update Order / Update Status    -   /api/v1/order/:id
const updateOrder = catchAsyncError(async (req, res, next) => {
    const orders = await Order.findById(req.params.id)

    if (orders.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Order has been already delivered'))
    }

    // updating the product stock for each order items
    orders.orderItems.forEach(async (orderItem) => {
        await updateStock(orderItem.product, orderItem.quantity)
    })

    orders.orderStatus = req.body.orderStatus
    orders.deliveredAt = Date.now()
    await orders.save()

    res.status(200).json({
        success: true
    })

})

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId)
    product.stock = product.stock - quantity
    product.save({ validateBeforeSave: false })
}


//Admin Delete Order   -  /api/v1/order/:id
const deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler(`order not found this ${req.params.id}`))
    }

    await order.deleteOne()

    res.status(200).json({
        success : true
    })
})

module.exports = {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
}