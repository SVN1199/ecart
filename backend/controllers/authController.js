const catchAsyncError = require('../middlewares/catchAsyncError')
const sendToken = require('../middlewares/jwt')
const User = require('../models/userModel')
const { sendEmail } = require('../utils/email')
const ErrorHandler = require('../utils/errorHandler')
const crypto = require('crypto')

const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body

    let avatar;

    //`${req.protocol}://${req.get('host')}`

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar
    })

    sendToken(user, 201, res)
})

const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email or password', 400))
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    if (! await user.isValidPassword(password)) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 201, res)

})

// user forgot password
const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler('User not found this email', 400))
    }

    // call getResetToken from userModel
    const resetToken = user.getResetToken()
    await user.save({ validateBeforeSave: false })

    let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    // resetUrl is to create url with reset token for user reset
    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`

    const message = `Your reset url is as follows \n\n 
    ${resetUrl} \n\n
    If you have not requested this email, please ignore
    `
    try {
        sendEmail({
            email: user.email,
            subject: 'ecart password recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }
})


const resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired'));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match'));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false })
    sendToken(user, 201, res)

})

const getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

const changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('password')

    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old Password is incorrect', 401))
    }

    user.password = req.body.password
    await user.save()

    res.status(200).json({
        success: true,
    })
})


const updateProfile = catchAsyncError(async (req, res) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    let avatar;

    //`${req.protocol}://${req.get('host')}`

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`
        newUserData = { ...newUserData, avatar }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        user
    })

})


// Admin : Get all user
const getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})

// Admin : Get specific user  /api/v1/admin/user/:id
const getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User not found this ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})


//Admin : Update user     /api/v1/admin/user/:id
const updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        user
    })
})


//Admin : delete user       /api/v1/admin/user/:id
const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User not found this ${req.params.id}`))
    }

    await user.deleteOne()

    res.status(200).json({
        success: true
    })
})


module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateProfile,
    getAllUser,
    getUser,
    updateUser,
    deleteUser
}