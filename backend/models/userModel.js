const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        maxLength: [6, 'Password cannot exceed 6 character'],
        select: false
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// to encrypt the password before save
// pre = before save
userSchema.pre('save', async function (next) {
    try {
        // Check if the password is modified before hashing
        if (!this.isModified('password')) {
            return next();
        }

        // Hash the password with a salt factor of 10
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});


// to create token 
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

// Compare user-entered password and password which is saved already in the database by the user
userSchema.methods.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetToken = function(){
    // Generate Token
    const token = crypto.randomBytes(20).toString('hex')

    // Generate Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

    // set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000 ;

    return token
}

const UserModel = mongoose.model('user', userSchema)
module.exports = UserModel