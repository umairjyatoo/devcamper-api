const express = require('express')
const router = express.Router({ mergeParams: true })
const { getAllReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require('../../Controllers/reviews')
const Review = require('../../Models/Review')
const advancedResults = require('./../../Middlewares/advanceResults')
const { protect, authorize } = require('../../Middlewares/auth')



router.route('/')
    .get(
        advancedResults(Review, {
            path: 'bootcamp',
            select: 'name description'
        }),
        getAllReviews)
    .post(protect, authorize('user', 'admin'), addReview)

router.route('/:id').get(getReview).put(protect, authorize('user', 'admin'), updateReview).delete(protect, authorize('user', 'admin'), deleteReview)

module.exports = router