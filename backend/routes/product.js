const express = require('express')
const router = express.Router()
const { getProducts, newProducts, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require('../controllers/productController')
const { isAuthenticateUser, authorizeRoles } = require('../middlewares/authenticate')
const multer = require('multer')
const path = require('path')

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', 'uploads/product'))
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})


router.route('/products').get(getProducts)
router.route('/product/:id').get(getSingleProduct)
router.route('/review').put(isAuthenticateUser, createReview)


//Admin routes
router.route('/product/new').post(isAuthenticateUser, authorizeRoles('admin'), upload.array('images'), newProducts)
router.route('/admin/products').get(isAuthenticateUser, authorizeRoles('admin'), getAdminProducts)
router.route('/admin/product/:id').delete(isAuthenticateUser, authorizeRoles('admin'), deleteProduct)
router.route('/admin/product/:id').put(isAuthenticateUser, authorizeRoles('admin'), upload.array('images'), updateProduct)
router.route('/admin/reviews').get(isAuthenticateUser, authorizeRoles('admin'), getReviews)
router.route('/admin/review').delete(isAuthenticateUser, authorizeRoles('admin'), deleteReview)

module.exports = router