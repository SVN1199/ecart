const express = require('express')
const { registerUser, loginUser, forgotPassword, resetPassword, getUserProfile, changePassword, updateProfile, getAllUser, getUser, updateUser, deleteUser } = require('../controllers/authController')
const { logoutUser, isAuthenticateUser, authorizeRoles } = require('../middlewares/authenticate')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', 'uploads/user'))
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/myprofile').get(isAuthenticateUser, getUserProfile)
router.route('/password/change').put(isAuthenticateUser, changePassword)
router.route('/update').put(isAuthenticateUser, upload.single('avatar'), updateProfile)


// Admin routes
router.route('/admin/users').get(isAuthenticateUser, authorizeRoles('admin'), getAllUser)
router.route('/admin/user/:id').get(isAuthenticateUser, authorizeRoles('admin'), getUser)
router.route('/admin/user/:id').put(isAuthenticateUser, authorizeRoles('admin'), updateUser)
router.route('/admin/user/:id').delete(isAuthenticateUser, authorizeRoles('admin'), deleteUser)


module.exports = router