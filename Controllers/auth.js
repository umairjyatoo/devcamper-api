const ErrorResponse = require('./../utils/errorResponse')
const User = require('../Models/User')
const asyncHandler = require('../Middlewares/async')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');

//@desc         Register user
//@route        POST /api/v1/auth/register
//@access       Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sentTokenResponse(user, 201, 'User created successfully', res)
});


//@desc         Login user
//@route        POST /api/v1/auth/login
//@access       Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    console.log(req.body)
    //Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse(`Please provide an email and password`, 400))
    }

    //check for the user
    const user = await User.findOne({ email }).select('+password');
    console.log("userExists ===>", user)
    if (user === null) {
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password)
    console.log(typeof isMatch)
    console.log(isMatch === false)
    if (isMatch === false) {
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }
    sentTokenResponse(user, 200, 'Login successful', res)
});

//@desc         Get current logged in user
//@route        GET /api/v1/auth/me
//@access       Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc         Forgot password
//@route        POST /api/v1/auth/forgotPassword
//@access       Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    //Check for user with that email
    if (!user) {
        return next(new ErrorResponse(`There is no user with this email`, 404))
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    //Create reset url

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
    Please make  a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail(({
            email: user.email,
            subject: 'Password reset token',
            message
        }));
        res.status(200).json({
            success: true,
            data: 'Email sent.'
        })
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse(`Email could not be sent`, 500))

    }
})

//@desc         Reset password
//@route        PUT /api/v1/auth/resetpassword/:resetToken
//@access       Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    //Get hash token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse(`Invalid token`, 400))
    }

    //Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sentTokenResponse(user, 200, 'Password reset successful', res);
})


//@desc         Update user
//@route        PUT /api/v1/auth/updatedetails
//@access       Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsUpated = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsUpated, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: user
    })
})


//@desc         Update password
//@route        PUT /api/v1/auth/updatepassword
//@access       Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')

    //Check current password
    if (!(await user.matchPassword(currentPassword))) {
        return next(new ErrorResponse(`Password is incorrect`, 401));
    }

    user.password = newPassword;
    await user.save();

    sentTokenResponse(user, 200, 'Password updated successfully', res);
})

//Get token from model, send cookie and send response
const sentTokenResponse = (user, statusCode, message, res) => {
    //Create token
    const token = user.getSignetJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_TOKEN_EXPIRATION * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message,
        token,
        data: user
    })
}