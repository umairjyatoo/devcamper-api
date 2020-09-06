const express = require('express')
const router = express.Router()
const { register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../Controllers/auth')
const { protect } = require('../Middlewares/auth')


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(protect, getMe)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetpassword/:resetToken').put(resetPassword)
router.route('/updatedetails').put(protect, updateDetails)
router.route('/updatepassword').put(protect, updatePassword)

module.exports = router