const catchAsyncError = require('../middlewares/catchAsyncError')
const Product = require('../models/productModel')
const ApiFeatures = require('../utils/apiFeatures')
const ErrorHandler = require('../utils/errorHandler')

/* const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().paginate(resPerPage) */

// Define an asynchronous function getProducts that takes request, response, and next as parameters
const getProducts = async (req, res, next) => {

    // Define the number of products to display per page
    const resPerPage = 3;

    // Define a function buildQuery that creates an instance of ApiFeatures with a query based on the request parameters
    const buildQuery = () => {
        return new ApiFeatures(Product.find(), req.query).search().filter();
    }

    // Count the total number of products after applying filters from the request
    const filteredProductsCount = await buildQuery().query.countDocuments({});

    // Count the total number of all products in the database
    const totalProductsCount = await Product.countDocuments({});

    // Initialize the products count to the total number of all products
    let productsCount = totalProductsCount;

    // If filtered products count is different from the total products count, update the products count
    if (filteredProductsCount != totalProductsCount) {
        productsCount = filteredProductsCount;
    }

    // Retrieve the products based on the query, pagination, and filters
    let products = await buildQuery().paginate(resPerPage).query;

    // Send a JSON response with success status, products count, products per page, and the retrieved products
    res.status(201).json({
        success: true,
        count: productsCount,
        resPerPage,
        products,
    });
}


const getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name email')

    if (!product) {
        return next(new ErrorHandler('Product Not Found', 400))
    }

    res.status(201).json({
        success: true,
        product,
    })
}

const newProducts = catchAsyncError(async (req, res) => {
    let images = []

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.files.length > 0) {
        req.files.forEach((file) => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`
            images.push({ image: url })
        })
    }

    req.body.images = images

    req.body.user = req.user.id // to set user(admin) id in the user document
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

const updateProduct = async (req, res) => {
    let product = await Product.findById(req.params.id)

    // uploading images

    let images = []  // otherwise empty images = []

    // if admin didn't clear the image from frontend, then the give code code would be executed
    // if images not cleared we keep existing images
    if (req.body.imageCleared === false) {
        images = product.images
    }

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.files.length > 0) {
        req.files.forEach((file) => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`
            images.push({ image: url })
        })
    }

    if (!product) {
        res.status(404).json({
            success: false,
            message: 'product not found'
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })
}

const deleteProduct = async (req, res) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        res.status(404).json({
            success: false,
            message: 'product not found'
        })
    }

    product = await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "Product Deleted"
    })
}

// create review   -   /api/v1/review
const createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body

    const review = {
        user: req.user.id,
        rating,
        comment
    }

    const product = await Product.findById(productId)

    //finding user review exists
    const isReviewed = product.reviews.find((review) => {
        return review.user.toString() == req.user.id.toString()
    })

    if (isReviewed) {
        //updating the  review
        product.reviews.forEach((review) => {
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })
    } else {
        // creating the review
        product.reviews.push(review)
        product.noOfReviews = product.reviews.length
    }

    // finding the average of the product reviews
    product.reviews.reduce((acc, review) => {
        return review.rating + acc
    }, 0) / product.reviews.length

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })
})


//Get Reviews - api/v1/reviews?id={productId}
const getReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate('reviews.user', 'name email')

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


//Delete Review - api/v1/review
const deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    //filtering the reviews which does match the deleting review id
    const reviews = product.reviews.filter((review) => {
        review._id.toString() !== req.query.id.toString()
    })

    //number of reviews 
    const noOfReviews = reviews.length

    //finding the average with the filtered reviews
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc
    }, 0) / reviews.length
    ratings = isNaN(ratings) ? 0 : ratings

    //save the product document
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        noOfReviews,
        ratings
    })

    res.status(200).json({
        success: true,
    })
})


// get admin products  -  /api/v1/admin/products


const getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find()
    res.status(200).send(
        {
            success: true,
            products
        }
    )
})


module.exports = {
    getProducts,
    newProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createReview,
    getReviews,
    deleteReview,
    getAdminProducts,
    updateProduct
}