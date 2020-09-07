const Review = require('./../Models/Review')
const Bootcamp = require('../Models/Bootcamp')
const ErrorResponse = require('./../utils/errorResponse')
const asyncHandler = require('../Middlewares/async');


//@desc         Get reviews
//@route        GET /api/v1/reviews
//@route        GET /api/v1/bootcamps/:bootcampId/reviews
//@access       Public
exports.getAllReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({
            bootcamp: req.params.bootcampId
        })
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        return res.status(200).json(res.advancedResults);
    }
});



//@desc         Get a single review
//@route        GET /api/v1/reviews/:id
//@access       Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name desciption'
    })
    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: review
    })
});



//@desc         Add a review
//@route        POST /api/v1/bootcamp/:bootcampId/reviews
//@access       Private
exports.addReview = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id


    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with the id of ${req.params.bootcampId}`, 404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data: review
    })
});



//@desc         Update review
//@route        PUT /api/v1/reviews/:id
//@access       Private
exports.updateReview = asyncHandler(async (req, res, next) => {

    const ID = req.params.id
    let review = await Review.findById(ID)

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.bootcampId}`, 404))
    }

    //Make sure review belongs to user or user is an admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401))
    }

    review = await Review.findByIdAndUpdate(ID, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: review
    })
});


//@desc         Delete review
//@route        DELETE /api/v1/reviews/:id
//@access       Private
exports.deleteReview = asyncHandler(async (req, res, next) => {

    const ID = req.params.id
    let review = await Review.findById(ID)

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.bootcampId}`, 404))
    }

    //Make sure review belongs to user or user is an admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401))
    }

    await review.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});