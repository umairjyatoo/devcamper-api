const express = require('express')
const router = express.Router()
const { getAllBootcamps,
    getBootcampById,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampUploadPhoto
} = require('../../Controllers/bootcamps')
const Bootcamp = require('../../Models/Bootcamp')
const advancedResults = require('../../Middlewares/advanceResults')
const { protect, authorize } = require('../../Middlewares/auth')

//Include other resource routers
const courseRouter = require('../Courses/course')
const reviewRouter = require('../Reviews/review')

//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)


router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampUploadPhoto)
router.route('/').get(advancedResults(Bootcamp, 'courses'), getAllBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp)
router.route('/:id').get(getBootcampById).put(protect, updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp)


module.exports = router