const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken')

// to authorize admin, user(for view only)
const isAuthenticateUser = catchAsyncError(async (req, res, next) => {
    // to get token from cookie
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler('Login first to handle this resource', 401))
    }

    // to decode the token 
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decode.id)
    next()
})


// to authorize admin only for create, update, delete products
const authorizeRoles = (...roles) =>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} not allowed`, 401))
        }
        next()
    }
}

const logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires : new Date(Date.now()),
        httpOnly : true
    })
    .status(200)
    .json({
        success : true,
        message : "Loggedout"
    })
}

module.exports = {
    isAuthenticateUser,
    authorizeRoles,
    logoutUser
}