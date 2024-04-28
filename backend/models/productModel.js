const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Product Name'],
        trim: true,
        maxLength: [100, "Product name cannot exceed more 100 characters"]
    },
    price: {
        type: Number,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please Enter Product Description']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        image: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, 'Please Enter Product Category'],
        enum: {
            values: [
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Homes'
            ],
            message: "Please select valid category"
        }
    },
    seller: {
        type: String,
        required: [true, 'Please enter product seller']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [20, 'Product Stock cannot exceed 20']
    },
    noOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user :{
              type :  mongoose.Schema.Types.ObjectId,
              ref : 'user'
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId // this is for to set user(admin) id (not public users)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

let productModel = mongoose.model('Product', productSchema)

module.exports = productModel