const ErrorResponse = require('./../utils/errorResponse')
const User = require('../Models/User')
const asyncHandler = require('../Middlewares/async')

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